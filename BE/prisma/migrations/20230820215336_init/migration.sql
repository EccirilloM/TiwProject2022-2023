/*
  Warnings:

  - You are about to alter the column `text` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `text` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `title` on the `Thread` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - A unique constraint covering the columns `[followerId,followedId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "text" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "title" SET DATA TYPE VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followedId_key" ON "Follow"("followerId", "followedId");
