import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";
import { getToken, type JWT } from "next-auth/jwt";

type CreateContextOptions = {
  token: JWT | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    token: opts.token,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  const token = await getToken({ req });

  return createInnerTRPCContext({
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
