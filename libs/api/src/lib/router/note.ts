import {
  createNoteController,
  deleteNoteController,
  findAllNotesController,
  findNoteController,
  updateNoteController,
} from '../controller/note.controller';
import {
  createNoteSchema,
  filterQuery,
  params,
  updateNoteSchema,
} from '../schema/note.schema';
import { publicProcedure, router } from '../trpc';

export const noteRouter = router({
  createNote: publicProcedure
    .input(createNoteSchema)
    .mutation(({ ctx, input }) => createNoteController({ ctx, input })),
  updateNote: publicProcedure
    .input(updateNoteSchema)
    .mutation(({ ctx, input }) =>
      updateNoteController({
        ctx,
        paramsInput: input.params,
        input: input.body,
      })
    ),
  deleteNote: publicProcedure
    .input(params)
    .mutation(({ ctx, input }) =>
      deleteNoteController({ ctx, paramsInput: input })
    ),
  getNote: publicProcedure
    .input(params)
    .query(({ ctx, input }) => findNoteController({ ctx, paramsInput: input })),
  getNotes: publicProcedure
    .input(filterQuery)
    .query(({ ctx, input }) =>
      findAllNotesController({ ctx, filterQuery: input })
    ),
});
