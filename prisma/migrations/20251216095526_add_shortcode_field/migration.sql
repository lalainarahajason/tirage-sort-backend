/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `Draw` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Draw" ADD COLUMN     "shortCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Draw_shortCode_key" ON "Draw"("shortCode");

-- CreateIndex
CREATE INDEX "Draw_shortCode_idx" ON "Draw"("shortCode");
