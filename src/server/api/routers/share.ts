import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const shareRouter = createTRPCRouter({
  info: protectedProcedure
    .input(z.object({ tabId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.prisma.article.findFirst({
        where: {
          tab: {
            id: input.tabId,
          },
          owner: {
            id: ctx.token.sub,
          },
        },
        select: {
          share: {
            select: {
              id: true,
              isShareActive: true,
              createdAt: true,
              expiredAt: true,
            },
          },
        },
      });

      if (!article) throw new TRPCError({ code: "NOT_FOUND" });

      if (article.share) return article.share;

      return null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        shareId: z.string().cuid(),
        isShareActive: z.boolean().optional(),
        expiredAt: z.date().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.share.update({
        where: {
          id: input.shareId,
          author: {
            id: ctx.token.sub,
          },
        },
        data: {
          isShareActive: input.isShareActive,
          expiredAt: input.expiredAt,
        },
      });
    }),

  read: publicProcedure
    .input(z.object({ shareId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.share.findFirst({
        where: {
          id: input.shareId,
        },
        select: {
          article: {
            select: {
              tab: {
                select: {
                  title: true,
                },
              },
              content: true,
              createdAt: true,
            },
          },
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),
});
