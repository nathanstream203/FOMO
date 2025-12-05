/*
  Warnings:

  - You are about to drop the column `name` on the `event` table. All the data in the column will be lost.
  - Added the required column `event_date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `name`,
    ADD COLUMN `event_date` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `party` MODIFY `start_time` VARCHAR(191) NOT NULL,
    MODIFY `end_time` VARCHAR(191) NOT NULL;
