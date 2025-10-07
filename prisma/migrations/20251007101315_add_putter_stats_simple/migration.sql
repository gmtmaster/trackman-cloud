-- AlterTable
ALTER TABLE "public"."Shot" ADD COLUMN     "distance" TEXT,
ADD COLUMN     "goodMakes" INTEGER,
ADD COLUMN     "misses" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "perfectMakes" INTEGER,
ADD COLUMN     "totalPutts" INTEGER;
