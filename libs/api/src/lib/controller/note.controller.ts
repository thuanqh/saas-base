import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { Context } from '../context';
import type {
  CreateNoteInput,
  FilterQueryInput,
  ParamsInput,
  UpdateNoteInput,
} from '../schema/note.schema';

export const createNoteController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateNoteInput;
}) => {
  try {
    const note = await ctx.prisma.note.create({
      data: {
        title: input.title,
        content: input.content,
        category: input.category,
        published: input.published,
      },
    });

    return {
      status: 'success',
      data: {
        note,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Note with that title already exists',
        });
      }
    }
    throw error;
  }
};

export const updateNoteController = async ({
  ctx,
  paramsInput,
  input,
}: {
  ctx: Context;
  paramsInput: ParamsInput;
  input: UpdateNoteInput['body'];
}) => {
  try {
    const updatedNote = await ctx.prisma.note.update({
      where: { id: paramsInput.noteId },
      data: input,
    });

    return {
      status: 'success',
      note: updatedNote,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Note with that title already exists',
        });
      }
    }
    throw error;
  }
};

export const findNoteController = async ({
  ctx,
  paramsInput,
}: {
  ctx: Context;
  paramsInput: ParamsInput;
}) => {
  const note = await ctx.prisma.note.findFirst({
    where: { id: paramsInput.noteId },
  });

  if (!note) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Note with that ID not found',
    });
  }

  return {
    status: 'success',
    note,
  };
};

export const findAllNotesController = async ({
  ctx,
  filterQuery,
}: {
  ctx: Context;
  filterQuery: FilterQueryInput;
}) => {
  const page = filterQuery.page || 1;
  const limit = filterQuery.limit || 10;
  const skip = (page - 1) * limit;

  const notes = await ctx.prisma.note.findMany({ skip, take: limit });

  return {
    status: 'success',
    results: notes.length,
    notes,
  };
};

export const deleteNoteController = async ({
  ctx,
  paramsInput,
}: {
  ctx: Context;
  paramsInput: ParamsInput;
}) => {
  try {
    await ctx.prisma.note.delete({ where: { id: paramsInput.noteId } });

    return {
      status: 'success',
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note with that ID not found',
        });
      }
    }
    throw error;
  }
};
