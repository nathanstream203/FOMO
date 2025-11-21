/*
  Warnings:

  - The values [checked_in,checked_out] on the enum `Attendance_log_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `attendance_log` MODIFY `status` ENUM('CHECKED_IN', 'CHECKED_OUT') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('BASIC', 'MANAGER', 'ADMIN') NOT NULL DEFAULT 'BASIC';

-- DropTable
DROP TABLE `role`;
