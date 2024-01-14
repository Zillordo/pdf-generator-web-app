import * as z from "zod";

export const createPdfSchema = z.object({
  base64: z.string(),
  name: z.string(),
  rewrite: z.boolean().optional(),
});

export const queryFilesByUserIdSchema = z.object({
  userId: z.string(),
});

export const deleteFilesByIdSchema = z.object({
  id: z.string(),
});
