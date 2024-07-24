// create a sudoku board
"use client";
import React, { useState } from 'react';
import { produce } from 'immer';

type Cell = {
  row: number;
  col: number;
  value: number | null;
};

type Board = Cell[][];

const createBoard = (): Board => {
  return Array.from({ length: 9 }, (_, rowIndex) => {
    return Array.from({ length: 9 }, (_, colIndex) => {
      return {
        row: rowIndex,
        col: colIndex,
        value: null,
      };
    });
  });
};

// generate a random sudoku board

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (board[row]?.[x]?.value === num || board[x]?.[col]?.value === num) {
      console.log('row or col');
      return false;
    }
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i]?.[startCol + j]?.value === num) {
        console.log('box');
        return false;
      }
    }
  }
  console.log('valid');
  return true;
}

function solveSudoku(board: Board, row = 0, col = 0): boolean {
  if (row === 9) return true;
  if (col === 9) return solveSudoku(board, row + 1, 0);
  if (board[row]?.[col]?.value !== undefined) return solveSudoku(board, row, col + 1);
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      if (board[row]?.[col]?.value !== undefined) {
        board[row][col].value = num;
        if (solveSudoku(board, row, col + 1)) return true;
        board[row][col] = { row, col, value: 0 }; // backtrack
      }
    }
  }
  console.log('backtrack');
  return false; // trigger backtracking
}

function generateSudokuBoard(): Board {
  console.log('generate');
  const board = createBoard();
  console.log("empty board", board);

  solveSudoku(board);
  console.log("solved board", board);

  return board;
}

const Cell = ({ cell, onClick, isSelected }: { cell: Cell; onClick: (cell: Cell) => void; isSelected: boolean }) => {
  return (
    <div
      className={`cell ${isSelected ? 'selected' : ''} border border-black w-10 h-10 flex justify-center items-center cursor-pointer`}
      onClick={() => onClick(cell)}
    >
      {cell.value}
    </div>
  );
};

const NumberSelector = ({ onClick }: { onClick: (value: number) => void }) => {
  return (
    <div className='flex space-x-10'>
      {Array.from({ length: 9 }, (_, index) => (
        <div key={index} className="border rounded-lg p-4 cursor-pointer" onClick={() => onClick(index + 1)}>
          {index + 1}
        </div>
      ))}
    </div>
  );
};

const SudokuBoard = () => {
  const [board, setBoard] = useState<Board>(generateSudokuBoard());
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const handleCellClick = (cell: Cell) => {
    setSelectedCell(cell);
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
    // use tailwind css to style the sudoku board
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className='mb-4'>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell) => (
              <Cell
                key={cell.col}
                cell={cell}
                onClick={handleCellClick}
                isSelected={selectedCell?.row === cell.row && selectedCell?.col === cell.col}
              />
            ))}
          </div>
        ))}
      </div>
      <NumberSelector onClick={handleNumberClick} />
    </div>
  );
};

export default SudokuBoard;