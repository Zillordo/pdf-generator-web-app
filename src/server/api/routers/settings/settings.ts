import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createSettingsSchema, updateSettingsSchema } from "./settings.schema";
import { UserRole } from "~/lib/constants";
import { TRPCError } from "@trpc/server";

export const settingsRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== UserRole.Admin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });
    }

    return await ctx.db.settings.findFirst();
  }),

  update: protectedProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== UserRole.Admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }

      return await ctx.db.settings.update({
        where: { id: input.id },
        data: { allowedNumberOfFiles: input.numberOfFilesAllowed },
      });
    }),

  create: protectedProcedure
    .input(createSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== UserRole.Admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }

      return await ctx.db.settings.create({
        data: {
          allowedNumberOfFiles: input.numberOfFilesAllowed,
        },
      });
    }),
});
