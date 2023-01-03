import { appRouter, createContext } from '@lungvang/api';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
