/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Bar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bar_name_key` ON `Bar`(`name`);
