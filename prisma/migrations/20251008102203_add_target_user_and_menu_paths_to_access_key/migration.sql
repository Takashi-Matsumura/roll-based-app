/*
  Warnings:

  - Added the required column `menuPaths` to the `AccessKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccessKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetUserId" TEXT,
    "menuPaths" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccessKey_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
-- Insert with empty JSON array as default menuPaths for existing records
INSERT INTO "new_AccessKey" ("createdAt", "createdBy", "expiresAt", "id", "isActive", "key", "name", "updatedAt", "menuPaths", "targetUserId")
SELECT "createdAt", "createdBy", "expiresAt", "id", "isActive", "key", "name", "updatedAt", '[]', NULL FROM "AccessKey";
DROP TABLE "AccessKey";
ALTER TABLE "new_AccessKey" RENAME TO "AccessKey";
CREATE UNIQUE INDEX "AccessKey_key_key" ON "AccessKey"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
