import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPdfSchema, deleteFilesByIdSchema } from "./image.schema";
import jsPDF from "jspdf";
import { getFileFormat } from "./image.utils";
import { TRPCError } from "@trpc/server";
import fs from "fs";

export const imageRoute = createTRPCRouter({
  deleteFile: protectedProcedure
    .input(deleteFilesByIdSchema)
    .mutation(async ({ input, ctx }) => {
      const file = await ctx.db.files.delete({ where: { id: input.id } });

      fs.unlink(file.path, (err) => {
        if (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "There was a problem with deleting file",
          });
        }

        return {
          status: "success",
          data: {
            message: "File deleted successfully",
          },
        };
      });
    }),

  getFiles: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.files.findMany();
  }),

  createPdf: protectedProcedure
    .input(createPdfSchema)
    .mutation(async ({ input, ctx }) => {
      const settings = await ctx.db.settings.findFirst();
      const files = await ctx.db.files.findMany();
      const allowedFileFormats = settings?.allowedNumberOfFiles;

      if (allowedFileFormats && files.length >= allowedFileFormats) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Number of allowed files exceeded, allowed number of files is ${allowedFileFormats}`,
        });
      }

      const sameNameFile = await ctx.db.files.findFirst({
        where: { name: input.name },
      });

      if (sameNameFile) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "File with this name already exists",
        });
      }

      try {
        const document = new jsPDF();
        const fileFormat = getFileFormat(input.base64);
        const filePath = `public/${input.name}.pdf`;

        document.addImage(input.base64, fileFormat, 0, 0, 210, 297);
        document.save(filePath);

        await ctx.db.files.create({
          data: {
            name: input.name,
            base64Preview: input.base64,
            path: filePath,
          },
        });
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
