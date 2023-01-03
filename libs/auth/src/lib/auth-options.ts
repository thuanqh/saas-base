import { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { prisma } from '@lungvang/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env['GITHUB_CLIENT_ID'] as string,
      clientSecret: process.env['GITHUB_CLIENT_SECRET'] as string,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
