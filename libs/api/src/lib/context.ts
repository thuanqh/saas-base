import { getServerSideSession, type Session } from '@lungvang/auth';
import { prisma } from '@lungvang/db';
import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

type CreateContextOptions = {
  session: Session | null;
};

export const CreateContextInner = async (opts?: CreateContextOptions) => {
  return {
    session: opts?.session,
    prisma,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSideSession(opts);

  return await CreateContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
