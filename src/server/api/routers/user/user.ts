import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createUserSchema, authorizeSchema } from "./user.schema";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            surname: input.surname,
            email: input.email,
            password: hashedPassword,
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
  authorize: publicProcedure
    .input(authorizeSchema)
    .query(async ({ input, ctx }) => {
      const userByEmail = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!userByEmail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with this email does not exist",
        });
      }

      if (userByEmail?.password !== input.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Provided credentials are invalid",
        });
      }

      return {
        id: userByEmail.id,
        name: userByEmail.name,
        surname: userByEmail.surname,
        email: userByEmail.email,
        role: userByEmail.role,
      };
    }),
});
