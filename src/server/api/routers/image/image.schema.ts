import * as z from "zod";

export const createPdfSchema = z.object({
  base64: z.string(),
  name: z.string(),
  rewrite: z.boolean().optional(),
});

export const getFilesByIdQuery = z.object({
  userId: z.string(),
});
