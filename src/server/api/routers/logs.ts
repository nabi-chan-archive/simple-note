import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const logRouter = createTRPCRouter({
  new: publicProcedure
    .input(
      z.object({
        message: z.string(),
        level: z.enum(["track", "info", "error"]),
        meta: z.string({}),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.log.create({
        data: {
          message: input.message,
          level: input.level,
          meta: input.meta,
          ip: ctx.ip,
        },
      });
    }),
});
