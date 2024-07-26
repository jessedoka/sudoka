"use client";
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { checkSudokuSolution } from './sudoku';

type Cell = {
    row: number;
    col: number;
    value: number | null;
    editable?: boolean;
};

type Board = Cell[][];

const Cell = ({ cell, onClick, isSelected, highlighted }: { cell: Cell; onClick: (cell: Cell) => void; isSelected: boolean; highlighted: boolean }) => {
    return (

        <div className={`w-4 h-4 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg  
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
                    <div
                        key={index}
                        className="p-2 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-200 duration-400 transition-colors text-lg sm:text-xl"
                        onClick={() => onClick(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))
            }
        </div>
    );
};

const SudokuBoard = ({ generatedBoard }: { generatedBoard: string }) => {
    // convert the generated board to a 2D array
    const generatedBoardArray = JSON.parse(generatedBoard) as Board;

    const [board, setBoard] = useState<Board>(generatedBoardArray);
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
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {isWon && <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4" > You won! </h2>
            }
            <div className="grid grid-cols-9 gap-4  mb-4">
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