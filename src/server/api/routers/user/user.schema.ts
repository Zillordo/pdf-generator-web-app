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

export const authorizeSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});
