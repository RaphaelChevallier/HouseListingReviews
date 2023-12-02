/*
  Warnings:

  - You are about to drop the column `zipCode` on the `Post` table. All the data in the column will be lost.
  - Added the required column `county` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "zipCode",
ADD COLUMN     "county" TEXT NOT NULL,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;
