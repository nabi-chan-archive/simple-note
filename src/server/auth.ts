import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type User as PrismaUser } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

import { featureFlag } from "@/constants/featureFlag";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends PrismaUser {
    level: "User" | "Admin";
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.level && user?.level !== "User") {
        token.level = user?.level;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    ...(env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    featureFlag.googleLogin
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
          }),
        ]
      : []),
    ...(env.KAKAO_CLIENT_ID && env.KAKAO_CLIENT_SECRET && featureFlag.kakaoLogin
      ? [
          KakaoProvider({
            clientId: env.KAKAO_CLIENT_ID ?? "",
            clientSecret: env.KAKAO_CLIENT_SECRET ?? "",
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/login",
    newUser: "/welcome",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
