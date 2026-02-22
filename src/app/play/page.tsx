import SudokuBoard from "@/components/sudokuBoard";
import generateSudokuBoard from "@/components/sudoku";

export default function Play() {
    const board = generateSudokuBoard(0.65);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <SudokuBoard generatedBoard={JSON.stringify(board)} />
        </div>
    );
}
