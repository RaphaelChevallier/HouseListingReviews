/*
  Warnings:

  - The `radiusUnits` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RadiusUnits" AS ENUM ('METERS', 'KILOMETERS', 'MILES', 'YARDS');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "radiusUnits",
ADD COLUMN     "radiusUnits" "RadiusUnits";
