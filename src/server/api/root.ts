import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { tabRouter } from "./routers/tabs";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  tab: tabRouter,
});

export type AppRouter = typeof appRouter;
