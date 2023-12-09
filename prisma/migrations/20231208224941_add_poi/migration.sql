/*
  Warnings:

  - You are about to drop the column `latitude` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "location" geography(Point, 4326);
