import { type Tab as PrismaTab } from "@prisma/client";

export type Tab = Pick<PrismaTab, "id" | "title">;
