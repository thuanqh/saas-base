import { router } from '../trpc';
import { postRouter } from './post';
import { authRouter } from './auth';

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
