import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { PrismaClient } from "@prisma/client"

const createMilestoneSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1, "Milestone name is required"),
  description: z.string().optional(),
  order: z.number().default(0),
})

const updateMilestoneSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  order: z.number().optional(),
})

const reorderMilestonesSchema = z.object({
  projectId: z.string().cuid(),
  milestones: z.array(
    z.object({
      id: z.string().cuid(),
      order: z.number(),
    }),
  ),
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

export const milestoneRouter = createTRPCRouter({
  // Get all milestones for a project (for project owner)
  getByProject: protectedProcedure.input(z.object({ projectId: z.string().cuid() })).query(async ({ ctx, input }) => {
    await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.projectId });
    const milestones = await ctx.db.milestone.findMany({
      where: { projectId: input.projectId },
      orderBy: { order: "asc" },
    })

    return milestones
  }),

  // Get milestones for public portal view
  getForPortal: publicProcedure.input(z.object({ projectId: z.string().cuid() })).query(async ({ ctx, input }) => {
    const milestones = await ctx.db.milestone.findMany({
      where: { projectId: input.projectId },
      orderBy: { order: "asc" },
    })

    return milestones
  }),

  // Create a new milestone
  create: protectedProcedure.input(createMilestoneSchema).mutation(async ({ ctx, input }) => {
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

    const milestone = await ctx.db.milestone.create({
      data: input,
    })

    return milestone
  }),

  // Update a milestone
  update: protectedProcedure.input(updateMilestoneSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input

    // Verify milestone ownership through project
    const existingMilestone = await ctx.db.milestone.findFirst({
      where: {
        id,
        project: {
          userId: ctx.session.user.id,
        },
      },
    })

    if (!existingMilestone) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Milestone not found",
      })
    }

    const milestone = await ctx.db.milestone.update({
      where: { id },
      data: updateData,
    })

    return milestone
  }),

  // Reorder milestones
  reorder: protectedProcedure.input(reorderMilestonesSchema).mutation(async ({ ctx, input }) => {
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

    // Update all milestone orders in a transaction
    await ctx.db.$transaction(
      input.milestones.map(({ id, order }) =>
        ctx.db.milestone.update({
          where: { id },
          data: { order },
        }),
      ),
    )

    return { success: true }
  }),

  // Delete a milestone
  delete: protectedProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    // Verify milestone ownership through project
    const milestone = await ctx.db.milestone.findFirst({
      where: {
        id: input.id,
        project: {
          userId: ctx.session.user.id,
        },
      },
    })

    if (!milestone) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Milestone not found",
      })
    }

    await ctx.db.milestone.delete({
      where: { id: input.id },
    })

    return { success: true }
  }),
})
