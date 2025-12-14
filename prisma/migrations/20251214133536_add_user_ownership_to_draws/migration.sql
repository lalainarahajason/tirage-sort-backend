/*
  Warnings:

  - Added the required column `userId` to the `Draw` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add userId column as nullable first
ALTER TABLE "Draw" ADD COLUMN "userId" TEXT;

-- Step 2: Assign existing draws to the first user in the database
UPDATE "Draw" 
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

-- Step 3: Make userId NOT NULL
ALTER TABLE "Draw" ALTER COLUMN "userId" SET NOT NULL;

-- Step 4: Add foreign key constraint
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
