import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tabRouter = createTRPCRouter({
  getTabList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany({
      where: {
        owner: {
          id: ctx.token?.sub,
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
  }),

  createTab: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tab.create({
        data: {
          title: input.title,
          order: 0,
          owner: {
            connect: {
              id: ctx.token?.sub,
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });
    }),

  removeTab: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tab.delete({
        where: {
          id: input.id,
          owner: {
            id: ctx.token?.sub,
          },
        },
      });
    }),

  renameTab: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        title: z.string().min(1).max(100),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tab.update({
        where: {
          id: input.id,
          owner: {
            id: ctx.token?.sub,
          },
        },
        data: {
          title: input.title,
        },
        select: {
          id: true,
          title: true,
        },
      });
    }),
});
