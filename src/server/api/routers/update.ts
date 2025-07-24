import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { PrismaClient } from "@prisma/client"

const updateContentSchema = z.object({
  time: z.number(),
  blocks: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      data: z.any(),
    })
  ),
  version: z.string(),
})

const saveUpdateSchema = z.object({
  id: z.string().cuid().optional().nullable(),
  name: z.string().min(1, "Title is required"),
  content: updateContentSchema,
  projectId: z.string().cuid(),
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

export const updateRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    const update = await ctx.db.update.findUnique({
      where: { id: input.id },
    })

    if (!update) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Update not found",
      })
    }
    
    // Verify membership or ownership
    await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: update.projectId })

    return update
  }),

  save: protectedProcedure.input(saveUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id, name, content, projectId } = input

    // Verify project ownership
    const project = await ctx.db.project.findFirst({
      where: {
        id: projectId,
        userId: ctx.session.user.id,
      },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    if (id) {
      // Update existing
      const updatedUpdate = await ctx.db.update.update({
        where: { id },
        data: { name, content: content as any },
      })
      return updatedUpdate
    } else {
      // Create new
      const newUpdate = await ctx.db.update.create({
        data: {
          name,
          content: content as any,
          projectId,
        },
      })
      return newUpdate
    }
  }),

  delete: protectedProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    // Verify update ownership through project
    const update = await ctx.db.update.findFirst({
      where: {
        id: input.id,
        project: {
          userId: ctx.session.user.id,
        },
      },
    })

    if (!update) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Update not found",
      })
    }

    await ctx.db.update.delete({
      where: { id: input.id },
    })

    return { success: true }
  }),
})
