-- CreateTable
CREATE TABLE `Friends` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requestor_id` INTEGER NOT NULL,
    `reciever_id` INTEGER NOT NULL,
    `status` ENUM('ACCEPTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Friends_requestor_id_reciever_id_key`(`requestor_id`, `reciever_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_requestor_id_fkey` FOREIGN KEY (`requestor_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_reciever_id_fkey` FOREIGN KEY (`reciever_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
