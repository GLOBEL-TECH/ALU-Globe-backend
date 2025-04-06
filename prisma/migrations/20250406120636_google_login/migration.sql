-- AlterTable
ALTER TABLE "CountryGroup" ADD COLUMN     "banner" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "countryGroupId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
