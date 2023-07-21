import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getToken, type JWT } from "next-auth/jwt";
import superjson from "superjson";
import { ZodError } from "zod";

import { prisma } from "@/server/db";

type CreateContextOptions = {
  token: JWT | null;
  ip: string;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ip: opts.ip,
    token: opts.token,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  const token = await getToken({ req });

  return createInnerTRPCContext({
    ip:
      (req.headers["x-real-ip"] as string | undefined) ||
      req.socket.remoteAddress ||
      "undefined",
    token,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      token: ctx.token,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
