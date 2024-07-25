// create a sudoku board
"use client";
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';

type Cell = {
    row: number;
    col: number;
    value: number | null;
    editable?: boolean;
};

type Board = Cell[][];

const createBoard = (): Board => {
    return Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => ({
            row: row,
            col: col,
            value: null,
            editable: true,
        }))
    );
};

// generate a random sudoku board

function isValid(board: Board, row: number, col: number, num: number): boolean {
    // check if the number is already in the row
    for (let i = 0; i < 9; i++) {
        if (board[row]?.[i]?.value === num) {
            return false;
        }
    }

    // check if the number is already in the column
    for (let i = 0; i < 9; i++) {
        if (board[i]?.[col]?.value === num) {
            return false;
        }
    }

    // check if the number is already in the 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow]?.[j + startCol]?.value === num) {
                return false;
            }
        }
    }

    return true;
}

// shuffle the board to generate a random sudoku board
const shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array;
}

function solveSudoku(board: Board, row = 0, col = 0): boolean {
    if (row === 9) {
        return true;
    }

    if (col === 9) {
        return solveSudoku(board, row + 1, 0);
    }

    if (board[row]?.[col]?.value !== null) {
        return solveSudoku(board, row, col + 1);
    }

    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of numbers) {
        if (isValid(board, row, col, num)) {
            board[row][col].value = num;
            board[row][col].editable = false;
            if (solveSudoku(board, row, col + 1)) {
                return true;
            }
            board[row][col].value = null;
            board[row][col].editable = true;
        }
    }

    return false;
}

function checkSudokuSolution(board: Board): boolean {
    const size = 9;
    const boxSize = 3;
    const numbers = new Set<number | null>();

    // Check if the board is fully filled
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row]?.[col]?.value === null) { // Assuming 0 represents an empty cell
                return false;
            }
        }
    }

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        numbers.clear();
        for (let j = 0; j < size; j++) {
            const value = board[i]?.[j]?.value;
            if (value !== undefined) {
                numbers.add(value);
            }
        }
        if (numbers.size !== size) return false;

        numbers.clear();
        for (let j = 0; j < size; j++) {
            const value = board[j]?.[i]?.value;
            if (value !== undefined) {
                numbers.add(value);
            }
        }
        if (numbers.size !== size) return false;
    }

    // Check 3x3 subgrids
    for (let row = 0; row < size; row += boxSize) {
        for (let col = 0; col < size; col += boxSize) {
            numbers.clear();
            for (let r = 0; r < boxSize; r++) {
                for (let c = 0; c < boxSize; c++) {
                    const value = board[row + r]?.[col + c]?.value;
                    if (value !== undefined) {
                        numbers.add(value);
                    }
                }
            }
            if (numbers.size !== size) return false;
        }
    }

    // If all checks pass, the puzzle is solved
    return true;
}

export function generateSudokuBoard(difficulty: number): Board {
    const board = createBoard();
    solveSudoku(board);

    const totalCells = 81;
    const cellsToRemove = Math.floor(totalCells * difficulty);

    let removedCells = 0;
    while (removedCells < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row]?.[col]?.value !== null && board[row]?.[col]?.value !== undefined) {
            board[row][col].value = null;
            board[row][col].editable = true;
            removedCells++;
        }
    }

    return board;
}

const Cell = ({ cell, onClick, isSelected, highlighted }: { cell: Cell; onClick: (cell: Cell) => void; isSelected: boolean; highlighted: boolean }) => {
    return (

        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg  
            ${isSelected ? 'duration-400 animate-pulse' : ''} cursor-pointer hover:bg-gray-400 duration-400 transition-colors ${cell.editable ? 'bg-gray-200' : ''} ${highlighted ? 'bg-sky-200' : ''} ${cell.col === 2 || cell.col === 5 ? 'mr-2' : ''} ${cell.row === 2 || cell.row === 5 ? 'mb-4' : ''}`}
            onClick={() => cell.editable && onClick(cell)}
        >
            {cell.value}
        </div>
    );
};

const NumberSelector = ({ onClick }: { onClick: (value: number) => void }) => {
    return (
        <div className='flex gap-2' >
            {
                Array.from({ length: 9 }, (_, index) => (
                    <div key={index} className="p-4 rounded-lg cursor-pointer hover:bg-gray-200 duration-400 transition-colors text-xl" onClick={() => onClick(index + 1)}>
                        {index + 1}
                    </div>
                ))
            }
        </div>
    );
};



const SudokuBoard = ({difficulty}: {difficulty: number}) => {
    const [board, setBoard] = useState<Board>(generateSudokuBoard(difficulty));
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        if (checkSudokuSolution(board)) {
            setIsWon(true);
        }
    }, [board]);

    const calculateHighlightedCells = (cell: Cell) => {
        const newHighlightedCells = new Set<string>();
        const { row, col } = cell;

        // Highlight row and column
        for (let i = 0; i < 9; i++) {
            newHighlightedCells.add(`${row},${i}`);
            newHighlightedCells.add(`${i},${col}`);
        }

        // Highlight 3x3 grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                newHighlightedCells.add(`${r},${c}`);
            }
        }

        return newHighlightedCells;
    };

    const handleCellClick = (cell: Cell) => {
        setSelectedCell(cell);
        setHighlightedCells(calculateHighlightedCells(cell));
    };


    const handleNumberClick = (value: number) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            setBoard((prevBoard) => {
                const newBoard: Board = produce(prevBoard, (draft) => {
                    if (draft[row]?.[col]) {
                        draft[row][col].value = value;
                    }
                });
                return newBoard;
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4" >
            {isWon && <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4" > You won! </h2>
            }
            <div className="grid grid-cols-9 gap-1 sm:gap-2 mb-4" >
                {
                    board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex},${colIndex}`}
                                cell={cell}
                                onClick={handleCellClick}
                                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                                highlighted={highlightedCells.has(`${rowIndex},${colIndex}`)}
                            />
                        ))
                    )}
            </div>
            <NumberSelector onClick={handleNumberClick} />
        </div>
    );
};

SudokuBoard.defaultProps = {
    difficulty: 0.5,
};



export default SudokuBoard;