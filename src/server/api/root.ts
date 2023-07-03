import { createTRPCRouter } from "~/server/api/trpc";
import { projectRoueter } from "./routers/project";
import { siteRouter } from "./routers/site";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRoueter,
  site: siteRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
