import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createSettingsSchema, updateSettingsSchema } from "./settings.schema";

export const settingsRouter = createTRPCRouter({
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.settings.findFirst({
      where: { userId: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.settings.update({
        where: { id: input.id },
        data: { allowedNumberOfFiles: input.numberOfFilesAllowed },
      });
    }),

  create: protectedProcedure
    .input(createSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.settings.create({
        data: {
          allowedNumberOfFiles: input.numberOfFilesAllowed,
          userId: ctx.session.user.id,
        },
      });
    }),
});
