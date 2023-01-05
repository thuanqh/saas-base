import { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';

import { prisma } from '@lungvang/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env['EMAIL_SERVER_HOST'],
        port: process.env['EMAIL_SERVER_PORT'],
        auth: {
          user: process.env['EMAIL_SERVER_USER'],
          pass: process.env['EMAIL_SERVER_PASSWORD'],
        },
      },
      from: process.env['EMAIL_FROM'],
    }),
    GithubProvider({
      clientId: process.env['GITHUB_CLIENT_ID'] as string,
      clientSecret: process.env['GITHUB_CLIENT_SECRET'] as string,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
};
