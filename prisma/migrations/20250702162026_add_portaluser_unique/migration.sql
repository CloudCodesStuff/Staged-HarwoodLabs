/*
  Warnings:

  - You are about to drop the `Portal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Portal" DROP CONSTRAINT "Portal_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PortalUser" DROP CONSTRAINT "PortalUser_portalId_fkey";

-- DropForeignKey
ALTER TABLE "PortalUser" DROP CONSTRAINT "PortalUser_userId_fkey";

-- DropTable
DROP TABLE "Portal";

-- DropTable
DROP TABLE "PortalUser";
