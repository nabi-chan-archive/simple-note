import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { tabRouter } from "./routers/tabs";
import { articleRouter } from "./routers/article";
import { printerRouter } from "./routers/printer";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  tab: tabRouter,
  article: articleRouter,
  printer: printerRouter,
});

export type AppRouter = typeof appRouter;
