-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'new_message';

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN "cooldown_until" TIMESTAMP(3);
