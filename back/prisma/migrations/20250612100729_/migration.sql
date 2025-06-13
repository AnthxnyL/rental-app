/*
  Warnings:

  - You are about to drop the column `havePaid` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "havePaid",
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT true;
