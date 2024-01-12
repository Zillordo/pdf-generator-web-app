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
import { api } from "~/utils/api";

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
    newUser: "/auth/sign-in",
    signIn: "/auth/login",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
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
        const { data, status } = api.user.authorize.useQuery({
          email: credentials?.email ?? "",
          password: credentials?.password ?? "",
        });

        if (status !== "success" && !data) {
          return null;
        }

        return data;
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
