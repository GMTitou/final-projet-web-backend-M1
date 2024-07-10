/*
  Warnings:

  - The primary key for the `Conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ConversationUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ConversationUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,conversationId]` on the table `ConversationUser` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `conversationId` on the `ConversationUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `conversationId` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ConversationUser" DROP CONSTRAINT "ConversationUser_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ConversationUser" DROP CONSTRAINT "ConversationUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "conversationId",
ADD COLUMN     "conversationId" INTEGER NOT NULL,
ADD CONSTRAINT "ConversationUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationId",
ADD COLUMN     "conversationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConversationUser_userId_conversationId_key" ON "ConversationUser"("userId", "conversationId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
