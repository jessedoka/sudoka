import SudokuBoard from "./_components/sudokuBoard";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // create a new puzzle 
  const puzzle = await api.puzzle.createDailyPuzzle();
  if (!puzzle) {
    throw new Error("Failed to create puzzle");
  }

  return (
    <HydrateClient>
      <div className="">
        <SudokuBoard generatedBoard={puzzle.board as string} />
      </div>
    </HydrateClient>
  );
}
