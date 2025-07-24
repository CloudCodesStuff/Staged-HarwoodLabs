import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";

// Real Resend email sender
async function sendEmail(to: string, subject: string, body: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error("Resend API key or FROM address not set");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    await resend.emails.send({
      from: 'Staged <onboarding@resend.dev>',
      to,
      subject,
      html: body,
    });
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
  }
}

export const portalRouter = createTRPCRouter({
  // Owner: Invite a user to the portal
  inviteUser: protectedProcedure
    .input(z.object({ portalId: z.string().cuid(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const portal = await ctx.db.portal.findFirst({
        where: { id: input.portalId, ownerId: ctx.session.user.id },
      });
      if (!portal) throw new TRPCError({ code: "FORBIDDEN", message: "Not portal owner" });

      // Check if user already exists
      const user = await ctx.db.user.findFirst({ where: { email: input.email } });
      let userId = user?.id ?? null;
      let status = user ? "active" : "invited";
      let inviteToken = null;
      if (!user) {
        // Generate secure invite token
        inviteToken = randomBytes(32).toString("hex");
      }

      // Upsert PortalUser by (portalId, email)
      await ctx.db.portalUser.upsert({
        where: { portalId_email: { portalId: input.portalId, email: input.email } },
        update: { status, inviteToken, userId },
        create: {
          portalId: input.portalId,
          userId,
          email: input.email,
          role: "client",
          status,
          invitedBy: ctx.session.user.id,
          inviteToken,
        },
      });

      // Send invite email if user doesn't exist
      if (!user && inviteToken) {
        const inviteUrl = `${process.env.NEXTAUTH_URL}/portal/invite/${inviteToken}`;
        await sendEmail(input.email, "You're invited to a portal", `Click here to join: ${inviteUrl}`);
      }

      return { success: true };
    }),

  // Invited user: Accept invite (token-based)
  acceptInvite: protectedProcedure
    .input(z.object({ inviteToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find pending invite for this token
      const invite = await ctx.db.portalUser.findFirst({
        where: { inviteToken: input.inviteToken, status: "invited" },
      });
      if (!invite) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired invite" });

      // Link to current user
      await ctx.db.portalUser.update({
        where: { id: invite.id },
        data: {
          userId: ctx.session.user.id,
          status: "active",
          inviteToken: null,
        },
      });
      return { success: true };
    }),

  // Owner: List all members
  listMembers: protectedProcedure
    .input(z.object({ portalId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      // Check ownership
      const portal = await ctx.db.portal.findFirst({
        where: { id: input.portalId, ownerId: ctx.session.user.id },
      });
      if (!portal) throw new TRPCError({ code: "FORBIDDEN", message: "Not portal owner" });

      const members = await ctx.db.portalUser.findMany({
        where: { portalId: input.portalId },
        include: { user: true },
      });
      return members.map(m => ({
        id: m.id,
        email: m.user?.email || m.email,
        role: m.role,
        status: m.status,
        invitedBy: m.invitedBy,
        createdAt: m.createdAt,
      }));
    }),

  // Owner: Remove (kick) a member
  removeMember: protectedProcedure
    .input(z.object({ portalUserId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Find membership
      const membership = await ctx.db.portalUser.findFirst({
        where: { id: input.portalUserId },
        include: { portal: true },
      });
      if (!membership) throw new TRPCError({ code: "NOT_FOUND", message: "Membership not found" });
      if (membership.portal.ownerId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Not portal owner" });

      await ctx.db.portalUser.update({
        where: { id: input.portalUserId },
        data: { status: "removed" },
      });
      return { success: true };
    }),

  // On login/signup: Activate any pending invites for this email
  activatePendingInvites: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = ctx.session.user;
      if (!user?.email) return { activated: 0 };
      // Find all pending invites for this email
      const invites = await ctx.db.portalUser.findMany({
        where: {
          email: user.email,
          status: "invited",
        },
      });
      let activated = 0;
      for (const invite of invites) {
        await ctx.db.portalUser.update({
          where: { id: invite.id },
          data: {
            userId: user.id,
            status: "active",
            inviteToken: null,
          },
        });
        activated++;
      }
      return { activated };
    }),

  getMyMembership: protectedProcedure
    .input(z.object({ portalId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      if (!user?.email) return null;
      // Find membership by userId or email
      const membership = await ctx.db.portalUser.findFirst({
        where: {
          portalId: input.portalId,
          OR: [
            { userId: user.id },
            { email: user.email },
          ],
        },
      });
      if (membership) return membership;
      // If not found, check if user is portal owner
      const portal = await ctx.db.portal.findFirst({ where: { id: input.portalId, ownerId: user.id } });
      if (portal) {
        return {
          id: "owner-synthetic",
          portalId: portal.id,
          userId: user.id,
          email: user.email,
          role: "owner",
          status: "active",
          invitedBy: null,
          inviteToken: null,
          createdAt: portal.createdAt,
          updatedAt: portal.updatedAt,
        };
      }
      return null;
    }),

  resendInvite: protectedProcedure
    .input(z.object({ portalId: z.string().cuid(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const portal = await ctx.db.portal.findFirst({
        where: { id: input.portalId, ownerId: ctx.session.user.id },
      });
      if (!portal) throw new TRPCError({ code: "FORBIDDEN", message: "Not portal owner" });
      // Find invite
      const invite = await ctx.db.portalUser.findFirst({
        where: { portalId: input.portalId, email: input.email },
      });
      if (!invite) throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      if (invite.status === "active") throw new TRPCError({ code: "BAD_REQUEST", message: "User is already active" });
      if (!invite.inviteToken) throw new TRPCError({ code: "BAD_REQUEST", message: "No invite token found" });
      const inviteUrl = `${process.env.NEXTAUTH_URL}/portal/invite/${invite.inviteToken}`;
      await sendEmail(input.email, "You're invited to a portal", `Click here to join: ${inviteUrl}`);
      return { success: true };
    }),
}); 