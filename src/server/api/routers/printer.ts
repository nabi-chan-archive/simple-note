import { printerSchema } from "@/schema/form/printer";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { print } from "@/server/printer";
import { type Block, type BlockSchema } from "@blocknote/core";

export const printerRouter = createTRPCRouter({
  getPrinter: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.printer.findFirst({
      where: {
        owner: {
          id: ctx.token.sub,
        },
      },
      select: {
        id: true,
        ip: true,
        port: true,
      },
    });
  }),

  createPrinter: protectedProcedure
    .input(printerSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.printer.create({
        data: {
          name: "printer",
          ip: input.ip,
          port: input.port,
          owner: {
            connect: {
              id: ctx.token.sub,
            },
          },
        },
        select: {
          id: true,
          ip: true,
          port: true,
        },
      });
    }),

  deletePrinter: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.printer.delete({
        where: {
          id: input.id,
          owner: {
            id: ctx.token.sub,
          },
        },
      });
    }),

  printArticle: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.token.sub,
        },
        select: {
          tab: {
            where: {
              id: input.id,
            },
            select: {
              title: true,
              article: {
                select: {
                  content: true,
                },
              },
            },
          },
          printer: {
            select: {
              ip: true,
              port: true,
            },
          },
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "record not found",
        });
      if (!user.printer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "printer not found",
        });
      if (!user.tab[0] || !user.tab[0].article)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: !user.tab[0] ? "tab not found" : "article not found",
        });

      await print({
        ip: user.printer.ip,
        port: user.printer.port,
        title: user.tab[0].title,
        blocks: user.tab[0].article.content as Block<BlockSchema>[],
      });

      return {
        success: true,
      };
    }),
});
