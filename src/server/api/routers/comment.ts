import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { PrismaClient } from "@prisma/client"

const createCommentSchema = z.object({
  projectId: z.string().cuid(),
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  content: z.string().min(1, "Comment content is required"),
})

async function requirePortalMemberOrOwner({ db, user, projectId }: { db: PrismaClient, user: any, projectId: string }) {
  const portal = await db.portal.findFirst({ where: { id: projectId } });
  if (!portal) throw new TRPCError({ code: "NOT_FOUND", message: "Portal not found" });
  if (portal.ownerId === user.id) return;
  const membership = await db.portalUser.findFirst({
    where: {
      portalId: portal.id,
      userId: user.id,
      status: "active",
    },
  });
  if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not a portal member" });
}

export const commentRouter = createTRPCRouter({
  // Get all comments for a project (for project owner)
  getByProject: protectedProcedure.input(z.object({ projectId: z.string().cuid() })).query(async ({ ctx, input }) => {
    await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.projectId });
    // Verify project ownership
    const project = await ctx.db.project.findFirst({
      where: {
        id: input.projectId,
        userId: ctx.session.user.id,
      },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    const comments = await ctx.db.comment.findMany({
      where: { projectId: input.projectId },
      orderBy: { createdAt: "desc" },
    })

    return comments
  }),

  // Get comments for public portal view (unprotected)
  getForPortal: publicProcedure.input(z.object({ projectId: z.string().cuid() })).query(async ({ ctx, input }) => {
    const comments = await ctx.db.comment.findMany({
      where: { projectId: input.projectId },
      orderBy: { createdAt: "desc" },
    })

    return comments
  }),

  // Create a new comment (unprotected - from client portal)
  create: publicProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
    // Verify project exists
    const project = await ctx.db.project.findUnique({
      where: { id: input.projectId },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    const comment = await ctx.db.comment.create({
      data: input,
    })

    return comment
  }),

  // Delete a comment (project owner only)
  delete: protectedProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    // Verify comment ownership through project
    const comment = await ctx.db.comment.findFirst({
      where: {
        id: input.id,
        project: {
          userId: ctx.session.user.id,
        },
      },
    })

    if (!comment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found",
      })
    }

    await ctx.db.comment.delete({
      where: { id: input.id },
    })

    return { success: true }
  }),
})
