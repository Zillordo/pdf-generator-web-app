import * as z from "zod";

export const updateSettingsSchema = z.object({
  id: z.string(),
  numberOfFilesAllowed: z.number(),
});

export const createSettingsSchema = z.object({
  numberOfFilesAllowed: z.number(),
});
