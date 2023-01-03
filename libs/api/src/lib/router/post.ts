import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: input } });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: input,
      });
      return post;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          title: z.string(),
          content: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const post = await ctx.prisma.post.update({
        where: { id },
        data,
      });
      return post;
    }),
  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.prisma.post.delete({ where: { id } });
      return id;
    }),
});
