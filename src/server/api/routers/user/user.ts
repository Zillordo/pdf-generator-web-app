import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { UserRole } from "~/lib/constants";
import * as z from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(0).max(50),
    surname: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
    role: z.nativeEnum(UserRole),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return "list";
  }),
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            surname: input.surname,
            email: input.email,
            password: input.password,
            role: input.role,
          },
        });

        return {
          status: "success",
          data: {
            user,
          },
        };
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User with this email already exists",
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Oops something went wrong!",
              cause: err.cause,
            });
          }
        }
        throw err;
      }
    }),
});
