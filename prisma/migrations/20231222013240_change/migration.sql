/*
  Warnings:

  - You are about to drop the column `location` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "stateOrProvince" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "location",
ADD COLUMN     "coordinates" geography(Point, 4326);
