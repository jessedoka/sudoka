import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import generateSudokuBoard  from "@/components/sudoku";

export const puzzleRouter = createTRPCRouter({
    createDailyPuzzle: publicProcedure
        .mutation(async({ ctx }) => {
            // difficulty is a number between 0 and 1 and is dependent on the date and year of the request

            // check if there is already a puzzle for today then return it
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            const puzzle = ctx.db.puzzle.findFirst({
                where: {
                    createdAt: {
                        gte: todayStart,
                        lt: todayEnd,
                    },
                },
            });

            if (await puzzle) {
                return puzzle;
            }
            
            return ctx.db.puzzle.create({
                data: {
                    board: JSON.stringify(generateSudokuBoard(0.65)),
                    difficulty: 0.65
                },
            });
        }),

    createPuzzle: publicProcedure
        .input(z.object({difficulty: z.number()}))
        .mutation(async({ input }) => {
            // we dont need to save the puzzle in the database
            return {
                difficulty: input.difficulty,
                board: JSON.stringify(generateSudokuBoard(input.difficulty)),
            };
        }),
});
