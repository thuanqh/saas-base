import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const todoRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      orderBy: {
        createAt: 'asc',
      },
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.task.create({
        data: input,
      });
      return todo;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          completed: z.boolean().optional(),
          text: z.string().min(1).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const todo = await ctx.prisma.task.update({
        where: { id },
        data,
      });
      return todo;
    }),
  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.prisma.task.delete({ where: { id } });
      return id;
    }),
  clearCompleted: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.task.deleteMany({ where: { completed: true } });

    return ctx.prisma.task.findMany();
  }),
});
