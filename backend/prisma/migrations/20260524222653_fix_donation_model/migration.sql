-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "donor_phone" TEXT,
ALTER COLUMN "donor_name" DROP NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'XOF',
ALTER COLUMN "status" SET DEFAULT 'PENDING';
