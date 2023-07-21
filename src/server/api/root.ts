import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";

import { articleRouter } from "./routers/article";
import { authRouter } from "./routers/auth";
import { logRouter } from "./routers/logs";
import { printerRouter } from "./routers/printer";
import { shareRouter } from "./routers/share";
import { tabRouter } from "./routers/tabs";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  tab: tabRouter,
  article: articleRouter,
  printer: printerRouter,
  share: shareRouter,
  log: logRouter,
});

export type AppRouter = typeof appRouter;
