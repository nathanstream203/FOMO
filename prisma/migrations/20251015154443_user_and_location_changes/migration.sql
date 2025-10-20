/*
  Warnings:

  - Added the required column `latitude` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebase_id` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bar` ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `party` ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `birth_date` DATETIME(3) NOT NULL,
    ADD COLUMN `firebase_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL;
