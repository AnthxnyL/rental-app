/*
  Warnings:

  - You are about to drop the column `nbApartment` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "UserId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nbApartment";

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
