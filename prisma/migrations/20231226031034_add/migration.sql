-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT 'USA',
ADD COLUMN     "stateOrProvinceCode" TEXT NOT NULL DEFAULT 'CA';
