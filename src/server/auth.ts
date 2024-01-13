import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type UserRole } from "~/lib/constants";

import { db } from "~/server/db";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      surname: string;
      email: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const userByEmail = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userByEmail) {
          throw new Error(
            "User with this email does not exist, please sign up first",
          );
        }

        const match = await bcrypt.compare(
          credentials.password,
          userByEmail.password,
        );

        if (!match) {
          throw new Error("The credentials you provided are invalid");
        }

        return {
          id: userByEmail.id,
          name: userByEmail.name,
          surname: userByEmail.surname,
          email: userByEmail.email,
          role: userByEmail.role,
        };
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
