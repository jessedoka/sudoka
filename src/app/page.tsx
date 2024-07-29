// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

import SudokuBoard from "../components/sudokuBoard";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // create a new puzzle 
  const puzzle = await api.puzzle.createDailyPuzzle();
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
