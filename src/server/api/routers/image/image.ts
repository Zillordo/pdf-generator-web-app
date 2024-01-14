import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPdfSchema } from "./image.schema";
import jsPDF from "jspdf";
import { getFileFormat } from "./image.utils";
import { TRPCError } from "@trpc/server";

export const imageRoute = createTRPCRouter({
  createPdf: protectedProcedure
    .input(createPdfSchema)
    .mutation(async ({ input }) => {
      try {
        const document = new jsPDF();
        const fileFormat = getFileFormat(input.base64);

        document.addImage(input.base64, fileFormat, 0, 0, 210, 297);
        document.save(`public/${input.name}.pdf`);

        return {
          status: "success",
          data: {
            message: "PDF created successfully",
          },
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oops something went wrong!",
        });
      }
    }),
});
