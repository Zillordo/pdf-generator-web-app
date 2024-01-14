import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user/user";
import { imageRoute } from "~/server/api/routers/image/image";
import { settingsRouter } from "./routers/settings/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  image: imageRoute,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
