import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

export const authRouter = createTRPCRouter({
  getChannelHash: protectedProcedure.query(({ ctx }) => {
    const memberId = ctx.token.sub;
    const secretKey = env.CHANNEL_SECRET;

    if (!secretKey) return "";

    if (!memberId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    const hash = crypto
      .createHmac("sha256", Buffer.from(secretKey, "hex"))
      .update(memberId)
      .digest("hex");

    return hash;
  }),
});
