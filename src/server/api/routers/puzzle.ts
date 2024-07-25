import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateSudokuBoard } from "@/app/_components/sudoku";

type Puzzle = {
    id: number;
    difficulty: number;
    board: number[][];
};


export const puzzleRouter = createTRPCRouter({
    createDailyPuzzle: publicProcedure
        .input(z.object({ difficulty: z.number() }))
        .mutation(({ ctx, input }) => {
            const board = generateSudokuBoard(input.difficulty);
            // convert board to a string
            return ctx.db.puzzle.create({
                data: {
                    difficulty: input.difficulty,
                    board: JSON.stringify(board),
                },
            });
        }),
});
