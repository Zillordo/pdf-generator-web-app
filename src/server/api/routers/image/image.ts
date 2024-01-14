import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPdfSchema, getFilesByIdQuery } from "./image.schema";
import jsPDF from "jspdf";
import { getFileFormat } from "./image.utils";
import { TRPCError } from "@trpc/server";
import fs from "fs";

export const imageRoute = createTRPCRouter({
  getImagesByUserId: protectedProcedure
    .input(getFilesByIdQuery)
    .query(async ({ input, ctx }) => {
      return await ctx.db.files.findMany({ where: { userId: input.userId } });
    }),

  createPdf: protectedProcedure
    .input(createPdfSchema)
    .mutation(async ({ input, ctx }) => {
      const sameNameFile = await ctx.db.files.findFirst({
        where: { name: input.name },
      });

      if (sameNameFile && !input.rewrite) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "File with this name already exists",
        });
      }

      try {
        const document = new jsPDF();
        const fileFormat = getFileFormat(input.base64);
        const filePath = `public/${input.name}.pdf`;

        if (input.rewrite && sameNameFile) {
          fs.unlink(sameNameFile.path, (err) => {
            if (err) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "There was a problem with rewriting existing file",
              });
            }

            document.addImage(input.base64, fileFormat, 0, 0, 210, 297);
            document.save(filePath);
            async () => {
              await ctx.db.files.update({
                where: { id: sameNameFile.id },
                data: {
                  name: input.name,
                  base64Preview: input.base64,
                  path: filePath,
                  userId: ctx.session.user.id,
                },
              });
            };
          });
        } else {
          document.addImage(input.base64, fileFormat, 0, 0, 210, 297);
          document.save(filePath);

          await ctx.db.files.create({
            data: {
              name: input.name,
              base64Preview: input.base64,
              path: filePath,
              userId: ctx.session.user.id,
            },
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oops, something went wrong",
        });
      }

      return {
        status: "success",
        data: {
          message: "PDF created successfully",
        },
      };
    }),
});
