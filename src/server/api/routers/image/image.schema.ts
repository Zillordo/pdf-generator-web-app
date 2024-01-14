import * as z from "zod";

export const createPdfSchema = z.object({
  base64: z.string(),
  name: z.string(),
});
