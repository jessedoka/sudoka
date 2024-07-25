/*
  Warnings:

  - You are about to drop the column `content` on the `Puzzle` table. All the data in the column will be lost.
  - Added the required column `board` to the `Puzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Puzzle" DROP COLUMN "content",
ADD COLUMN     "board" TEXT NOT NULL;
