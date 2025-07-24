import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/welcome";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

const onboardingInfoSchema = z.object({
    role: z.string().min(1, "Please select your role"),
    company: z.string().optional(),
    teamSize: z.string().min(1, "Please select your team size"),
    workflowStyle: z.string().min(1, "Please select your workflow style"),
    primaryGoal: z.string().min(1, "Please select your primary goal")
});

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
    }))
    .mutation(async ({ ctx, input }) => {
      
      const userId = ctx.session.user.id;

      try {
        const updatedUser = await ctx.db.user.update({
          where: { id: userId },
          data: {
            name: input.name,
          },
        });
        return updatedUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile.",
        });
      }
    }),
    isOnboarded: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.db.user.findUnique({ where: { id: userId }, select: { onboarded: true } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      return { onboarded: user.onboarded };
    }),
    completeOnboarding: protectedProcedure
        .input(onboardingInfoSchema)
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx.session;

            // 1. Save onboarding data
            await ctx.db.userOnboarding.create({
                data: {
                    userId: user.id,
                    role: input.role,
                    company: input.company,
                    teamSize: input.teamSize,
                    workflowStyle: input.workflowStyle,
                    primaryGoal: input.primaryGoal,
                    completedAt: new Date()
                }
            });

            // 2. Update user to be onboarded
            await ctx.db.user.update({
                where: { id: user.id },
                data: { onboarded: true }
            });

            // 3. Send welcome email
            if (user.email && user.name) {
                try {
                    await resend.emails.send({
                        from: 'Staged <onboarding@resend.dev>',
                        to: user.email,
                        subject: 'Welcome to Staged!',
                        react: WelcomeEmail({ name: user.name }),
                    });
                } catch (error) {
                    console.error("Failed to send welcome email during onboarding completion:", JSON.stringify(error, null, 2));
                    // Do not throw an error, just log it. The user has been onboarded successfully.
                }
            }
            
            return { success: true };
        }),
    sendWelcomeEmail: protectedProcedure.mutation(async ({ ctx }) => {
        const { user } = ctx.session;
        if (!user.email || !user.name) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User email or name is missing.",
            });
        }
        console.log("Test")

        try {
            await resend.emails.send({
                from: 'Staged <onboarding@resend.dev>',
                to: user.email,
                subject: 'Welcome to Staged!',
                react: WelcomeEmail({ name: user.name }),
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to send welcome email from debug button:", JSON.stringify(error, null, 2));
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to send email.",
            });
        }
    }),
}); 