import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tabRouter = createTRPCRouter({
  getTabList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany({
      where: {
        owner: {
          id: ctx.token?.sub,
        },
        article: {
          isSaved: false,
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }),

  createTab: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().nullish(),
        title: z.string().min(1).max(100),
        order: z.number().default(0),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tab.create({
        data: {
          id: input.id ?? undefined,
          title: input.title,
          order: input.order,
          owner: {
            connect: {
              id: ctx.token?.sub,
            },
          },
          article: {
            create: {
              content: [],
              owner: {
                connect: {
                  id: ctx.token?.sub,
                },
              },
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

  reorderTab: protectedProcedure
    .input(
      z.object({
        tabList: z
          .object({
            id: z.string().cuid(),
            order: z.number(),
          })
          .array(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.$transaction(
        input.tabList.map((tab) =>
          ctx.prisma.tab.update({
            where: {
              id: tab.id,
              owner: {
                id: ctx.token?.sub,
              },
            },
            data: {
              order: tab.order,
            },
            select: {
              id: true,
              title: true,
              order: true,
            },
          })
        )
      );
    }),
});
