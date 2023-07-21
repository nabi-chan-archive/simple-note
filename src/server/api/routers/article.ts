import { type BlockSchema, type PartialBlock } from "@blocknote/core";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const articleRouter = createTRPCRouter({
  getArticle: protectedProcedure
    .input(z.object({ tabId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.article.findFirst({
        where: {
          tabId: input.tabId,
          owner: {
            id: ctx.token.sub,
          },
        },
        select: {
          content: true,
        },
      });

      if (!response) throw new TRPCError({ code: "NOT_FOUND" });

      return response.content as PartialBlock<BlockSchema>[];
    }),

  updateArticle: protectedProcedure
    .input(z.object({ tabId: z.string(), content: z.any().array() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.article.update({
        where: {
          tabId: input.tabId,
          owner: {
            id: ctx.token.sub,
          },
        },
        data: {
          content: input.content,
        },
      });
    }),
});
