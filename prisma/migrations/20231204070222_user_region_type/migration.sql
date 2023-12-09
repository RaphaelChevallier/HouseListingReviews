/*
  Warnings:

  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "RegionType" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
