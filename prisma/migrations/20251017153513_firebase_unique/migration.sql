/*
  Warnings:

  - A unique constraint covering the columns `[firebase_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Users_firebase_id_key` ON `Users`(`firebase_id`);
