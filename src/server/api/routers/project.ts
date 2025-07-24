import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { PrismaClient } from "@prisma/client"

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
})

const updateProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).optional(),
  clientName: z.string().min(1).optional(),
  description: z.string().optional(),
})

const updatePortalStyleSchema = z.object({
  id: z.string().cuid(),
  primaryColor: z
    .string()
    .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i).optional(),
  textColor: z
    .string()
    .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i).optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)
    .optional(),
  textSize: z.enum(["sm", "base", "lg"]).optional(),
  spacing: z.enum(["tight", "normal", "loose"]).optional(),
  roundedness: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
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

export const projectRouter = createTRPCRouter({
  // Get all projects for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        updates: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        milestones: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 2,
        },
        _count: {
          select: {
            updates: true,
            milestones: true,
            comments: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return projects
  }),

  // Get a single project with all data (for project owner)
  getById: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    const project = await ctx.db.project.findFirst({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
      include: {
        updates: {
          orderBy: { createdAt: "desc" },
        },
        milestones: {
          orderBy: { order: "asc" },
        },
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    return project
  }),

  // Get project for public portal view
  getForPortal: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.id });
    const project = await ctx.db.project.findUnique({
      where: { id: input.id },
      include: {
        updates: {
          orderBy: { createdAt: "desc" },
        },
        milestones: {
          orderBy: { order: "asc" },
        },
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    return project
  }),

  // Create a new project
  create: protectedProcedure.input(createProjectSchema).mutation(async ({ ctx, input }) => {
    const { session } = ctx;
    const { user } = session;

    const isSubscribed = user.stripeSubscriptionStatus === "active";

    if (!isSubscribed) {
      const projectCount = await ctx.db.project.count({
        where: {
          userId: user.id,
        },
      });

      if (projectCount >= 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have reached the maximum number of projects for the free plan. Please upgrade to create more.",
        });
      }
    }

    // Create project and portal in a transaction
    const [project, portal] = await ctx.db.$transaction([
      ctx.db.project.create({
        data: {
          ...input,
          userId: user.id,
        },
      }),
      ctx.db.portal.create({
        data: {
          id: undefined, // will set below
          name: input.name,
          ownerId: user.id,
        },
      }),
    ]);

    // Set portal id to match project id (if 1:1 mapping)
    if (portal.id !== project.id) {
      await ctx.db.portal.update({ where: { id: portal.id }, data: { id: project.id } });
    }

    // Create PortalUser for owner
    await ctx.db.portalUser.create({
      data: {
        portalId: project.id,
        userId: user.id,
        email: user.email || '',
        role: "owner",
        status: "active",
      },
    });

    return project;
  }),

  // Update project details
  update: protectedProcedure.input(updateProjectSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input

    // Verify ownership
    const existingProject = await ctx.db.project.findFirst({
      where: {
        id,
        userId: ctx.session.user.id,
      },
    })

    if (!existingProject) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    const project = await ctx.db.project.update({
      where: { id },
      data: updateData,
    })

    return project
  }),

  // Update portal styling
  updatePortalStyle: protectedProcedure.input(updatePortalStyleSchema).mutation(async ({ ctx, input }) => {
    const { id, ...styleData } = input

    // Verify ownership
    const existingProject = await ctx.db.project.findFirst({
      where: {
        id,
        userId: ctx.session.user.id,
      },
    })

    if (!existingProject) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    const project = await ctx.db.project.update({
      where: { id },
      data: styleData,
    })

    return project
  }),

  // Delete a project
  delete: protectedProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    // Verify ownership
    const project = await ctx.db.project.findFirst({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    })

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      })
    }

    // Delete all related records in a transaction
    await ctx.db.$transaction([
      // Delete ActivityLogs
      ctx.db.activityLog.deleteMany({ where: { projectId: input.id } }),
      // Delete Comments
      ctx.db.comment.deleteMany({ where: { projectId: input.id } }),
      // Delete Milestones
      ctx.db.milestone.deleteMany({ where: { projectId: input.id } }),
      // Delete Updates
      ctx.db.update.deleteMany({ where: { projectId: input.id } }),
      // Delete Documents and their versions
      ctx.db.documentVersion.deleteMany({ where: { document: { projectId: input.id } } }),
      ctx.db.document.deleteMany({ where: { projectId: input.id } }),
      // Delete Portal and PortalUsers if 1:1 mapping
      ctx.db.portalUser.deleteMany({ where: { portalId: input.id } }),
      ctx.db.portal.deleteMany({ where: { id: input.id } }),
      // Finally, delete the project
      ctx.db.project.delete({ where: { id: input.id } }),
    ])

    return { success: true }
  }),

  // Get dashboard stats
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const [totalProjects, totalUpdates, totalMilestones, totalComments] = await Promise.all([
      ctx.db.project.count({
        where: { userId },
      }),
      ctx.db.update.count({
        where: {
          project: { userId },
        },
      }),
      ctx.db.milestone.count({
        where: {
          project: { userId },
        },
      }),
      ctx.db.comment.count({
        where: {
          project: { userId },
        },
      }),
    ])

    return {
      totalProjects,
      totalUpdates,
      totalMilestones,
      totalComments,
    }
  }),
})
