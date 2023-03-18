import { router } from '../trpc';
import { todoRouter } from './todo';
import { postRouter } from './post';
import { authRouter } from './auth';
import { noteRouter } from './note';

export const appRouter = router({
  note: noteRouter,
  todo: todoRouter,
  post: postRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
