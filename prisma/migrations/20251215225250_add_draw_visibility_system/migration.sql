/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Draw` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DrawVisibility" AS ENUM ('PUBLIC', 'SHARED', 'PRIVATE');

-- AlterTable
ALTER TABLE "Draw" ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "visibility" "DrawVisibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE UNIQUE INDEX "Draw_shareToken_key" ON "Draw"("shareToken");

-- CreateIndex
CREATE INDEX "Draw_shareToken_idx" ON "Draw"("shareToken");
