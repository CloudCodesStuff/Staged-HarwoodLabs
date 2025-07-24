import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

async function requirePortalMemberOrOwner({ db, user, projectId }: { db: PrismaClient, user: any, projectId: string }) {
  // Find the portal for this project
  const portal = await db.portal.findFirst({ where: { id: projectId } });
  if (!portal) throw new TRPCError({ code: "NOT_FOUND", message: "Portal not found" });
  // Owner always allowed
  if (portal.ownerId === user.id) return;
  // Check active membership
  const membership = await db.portalUser.findFirst({
    where: {
      portalId: portal.id,
      userId: user.id,
      status: "active",
    },
  });
  if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not a portal member" });
}

export const fileLinkRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.projectId });
      const docs = await ctx.db.document.findMany({
        where: {
          projectId: input.projectId,
          type: "file-link",
        },
        orderBy: { createdAt: "asc" },
        include: { versions: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      return docs.map((doc) => ({
        id: doc.id,
        name: doc.title,
        url: doc.versions[0]?.fileUrl || "",
        createdAt: doc.createdAt,
      }));
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        name: z.string().min(1),
        url: z.string().url(),
        parentId: z.string().cuid().nullable().optional(),
        tags: z.array(z.string()).optional(),
        isFolder: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: { id: input.projectId, userId: ctx.session.user.id },
      });
      if (!project)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only project owner can add file links",
        });

      const isPro = ctx.session.user.stripeSubscriptionStatus === "active";
      if (!isPro && !input.isFolder) {
        const count = await ctx.db.document.count({
          where: {
            projectId: input.projectId,
            userId: ctx.session.user.id,
            type: "file-link",
            isFolder: false,
          },
        });
        if (count >= 3)
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Free plan file link limit (3) reached. Upgrade to Studio for unlimited files.",
          });
      }

      const doc = await ctx.db.document.create({
        data: {
          userId: ctx.session.user.id,
          projectId: input.projectId,
          type: "file-link",
          title: input.name,
          status: "active",
          isFolder: input.isFolder ?? false,
          parentId: input.parentId ?? null,
          tags: input.tags ?? [],
          ownerId: ctx.session.user.id,
          ...(input.isFolder
            ? {}
            : {
                versions: {
                  create: [
                    {
                      fileUrl: input.url,
                      uploadedBy: ctx.session.user.id,
                      createdBy: ctx.session.user.id,
                    },
                  ],
                },
              }),
        },
        include: {
          versions: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });

      await ctx.db.activityLog.create({
        data: {
          projectId: input.projectId,
          userId: ctx.session.user.id,
          action: input.isFolder ? "add_folder" : "add_file_link",
          targetId: doc.id,
          targetType: input.isFolder ? "folder" : "file-link",
          message: input.isFolder
            ? `Added folder '${input.name}'`
            : `Added file link '${input.name}'`,
        },
      });

      return {
        id: doc.id,
        name: doc.title,
        url: doc.versions[0]?.fileUrl || "",
        createdAt: doc.createdAt,
        parentId: doc.parentId,
        tags: doc.tags,
        isFolder: doc.isFolder,
      };
    }),

  // 🔧 Updated input schema to accept `null` for parentId in relevant queries
  listFolders: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        parentId: z.string().cuid().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.projectId });
      const folders = await ctx.db.document.findMany({
        where: {
          projectId: input.projectId,
          isFolder: true,
        },
        orderBy: { createdAt: "asc" },
      });
      return folders.map((folder) => ({
        id: folder.id,
        name: folder.title,
        isFolder: true,
        createdAt: folder.createdAt,
        parentId: folder.parentId,
        tags: folder.tags,
      }));
    }),

  listFiles: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        parentId: z.string().cuid().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      await requirePortalMemberOrOwner({ db: ctx.db, user: ctx.session.user, projectId: input.projectId });
      const files = await ctx.db.document.findMany({
        where: {
          projectId: input.projectId,
          isFolder: false,
        },
        orderBy: { createdAt: "asc" },
        include: {
          versions: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
      return files.map((file) => ({
        id: file.id,
        name: file.title,
        isFolder: false,
        url: file.versions[0]?.fileUrl || "",
        createdAt: file.createdAt,
        parentId: file.parentId,
        tags: file.tags,
      }));
    }),

  // 🔧 If you use `parentId` in any other input schemas, apply `.nullable().optional()` there too

  // Delete a file or folder (document) by id
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const doc = await ctx.db.document.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });

      // Helper: recursively delete all children and their versions
      async function deleteDocumentAndChildren(documentId: string) {
        // Delete all children recursively
        const children = await ctx.db.document.findMany({ where: { parentId: documentId } });
        for (const child of children) {
          await deleteDocumentAndChildren(child.id);
        }
        // Delete all versions for this document
        await ctx.db.documentVersion.deleteMany({ where: { documentId } });
        // Delete the document itself
        await ctx.db.document.delete({ where: { id: documentId } });
      }

      await deleteDocumentAndChildren(input.id);
      return { success: true };
    }),
});
