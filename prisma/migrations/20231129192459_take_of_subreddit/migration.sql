/*
  Warnings:

  - You are about to drop the column `subredditId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subredditId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `Subreddit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Subreddit" DROP CONSTRAINT "Subreddit_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_subredditId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "subredditId";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "subredditId",
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "Subreddit";
