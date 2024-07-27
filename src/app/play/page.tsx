import SudokuBoard from "@/components/sudokuBoard";
import { api, HydrateClient } from "@/trpc/server";

export default async function Play() {
    // create a new puzzle 
    const puzzle = await api.puzzle.createPuzzle({ difficulty: 0.02 });
    if (!puzzle) {
        throw new Error("Failed to create puzzle");
    }

    return (
        <HydrateClient>
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <SudokuBoard generatedBoard={puzzle.board} />
            </div>
        </HydrateClient>
    );
}
