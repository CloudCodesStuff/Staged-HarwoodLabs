import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "./routers/project";
import { commentRouter } from "./routers/comment";
import { milestoneRouter } from "./routers/milestone";
import { updateRouter } from "./routers/update";
import { userRouter } from "./routers/user";
import { stripeRouter } from "./routers/stripe";
import { fileLinkRouter } from "./routers/fileLink";
import { portalRouter } from "./routers/portal";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  project: projectRouter,
  stripe:stripeRouter,
  comment: commentRouter,
  milestone: milestoneRouter,
  user: userRouter,
  update: updateRouter,
  fileLink: fileLinkRouter,
  portal: portalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
