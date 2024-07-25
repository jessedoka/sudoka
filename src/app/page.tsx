import Link from "next/link";
import SudokuBoard from "./_components/sudoku";

import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // creating a sudoku game
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <SudokuBoard />
      </div>
    </HydrateClient>
  );
}
