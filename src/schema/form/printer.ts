import { z } from "zod";

export const printerSchema = z.object({
  ip: z.string().ip(),
  port: z.string().regex(/^\d+$/),
});

export type PrinterSchemaValues = z.infer<typeof printerSchema>;
