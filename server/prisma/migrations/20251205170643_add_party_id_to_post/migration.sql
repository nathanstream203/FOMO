-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_bar_id_fkey`;

-- DropIndex
DROP INDEX `Post_bar_id_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `party_id` INTEGER NULL,
    MODIFY `bar_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_bar_id_fkey` FOREIGN KEY (`bar_id`) REFERENCES `Bar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_party_id_fkey` FOREIGN KEY (`party_id`) REFERENCES `Party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
