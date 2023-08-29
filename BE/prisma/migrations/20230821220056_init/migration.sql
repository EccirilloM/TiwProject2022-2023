/*
  Warnings:

  - You are about to drop the column `commentId` on the `Dislike` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Dislike` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Dislike` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Like` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `Dislike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Dislike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('THREAD', 'MESSAGE', 'COMMENT');

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_threadId_fkey";

-- AlterTable
ALTER TABLE "Dislike" DROP COLUMN "commentId",
DROP COLUMN "messageId",
DROP COLUMN "threadId",
ADD COLUMN     "entityId" INTEGER NOT NULL,
ADD COLUMN     "entityType" "EntityType" NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "commentId",
DROP COLUMN "messageId",
DROP COLUMN "threadId",
ADD COLUMN     "entityId" INTEGER NOT NULL,
ADD COLUMN     "entityType" "EntityType" NOT NULL;
