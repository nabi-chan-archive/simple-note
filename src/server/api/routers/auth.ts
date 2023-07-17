import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getProviders } from "next-auth/react";

export const authRouter = createTRPCRouter({
  provider: publicProcedure.query(() => {
    return getProviders();
  }),
});
