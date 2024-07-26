import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import generateSudokuBoard  from "@/app/_components/sudoku";



export const puzzleRouter = createTRPCRouter({
    createDailyPuzzle: publicProcedure
        .mutation(async({ ctx }) => {
            // difficulty is a number between 0 and 1 and is dependent on the date and year of the request
            const difficulty = Math.abs(Math.sin(new Date().getDate() * new Date().getFullYear()));

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
                    difficulty: difficulty,
                    board: JSON.stringify(generateSudokuBoard(difficulty)),
                },
            });
        }),
});
