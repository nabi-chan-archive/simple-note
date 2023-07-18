import { printerSchema } from "@/schema/form/printer";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

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
});
