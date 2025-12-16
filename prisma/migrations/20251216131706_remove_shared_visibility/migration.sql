/*
  Warnings:

  - The values [SHARED] on the enum `DrawVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DrawVisibility_new" AS ENUM ('PUBLIC', 'PRIVATE');
ALTER TABLE "public"."Draw" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Draw" ALTER COLUMN "visibility" TYPE "DrawVisibility_new" USING ("visibility"::text::"DrawVisibility_new");
ALTER TYPE "DrawVisibility" RENAME TO "DrawVisibility_old";
ALTER TYPE "DrawVisibility_new" RENAME TO "DrawVisibility";
DROP TYPE "public"."DrawVisibility_old";
ALTER TABLE "Draw" ALTER COLUMN "visibility" SET DEFAULT 'PUBLIC';
COMMIT;
