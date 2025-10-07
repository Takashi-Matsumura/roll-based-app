-- CreateTable: New Access Key tables
CREATE TABLE "AccessKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AccessKeyPermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessKeyId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessKeyPermission_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AccessKeyPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "UserAccessKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accessKeyId" TEXT NOT NULL,
    "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAccessKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAccessKey_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate data from ApiKey to AccessKey
INSERT INTO "AccessKey" ("id", "key", "name", "expiresAt", "isActive", "createdBy", "createdAt", "updatedAt")
SELECT "id", "key", "name", "expiresAt", "isActive", "createdBy", "createdAt", "updatedAt"
FROM "ApiKey";

-- Migrate data from ApiKeyPermission to AccessKeyPermission
INSERT INTO "AccessKeyPermission" ("id", "accessKeyId", "permissionId", "createdAt")
SELECT "id", "apiKeyId", "permissionId", "createdAt"
FROM "ApiKeyPermission";

-- Migrate data from UserApiKey to UserAccessKey
INSERT INTO "UserAccessKey" ("id", "userId", "accessKeyId", "activatedAt")
SELECT "id", "userId", "apiKeyId", "activatedAt"
FROM "UserApiKey";

-- Drop old tables
DROP TABLE "UserApiKey";
DROP TABLE "ApiKeyPermission";
DROP TABLE "ApiKey";

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_key_key" ON "AccessKey"("key");
CREATE UNIQUE INDEX "AccessKeyPermission_accessKeyId_permissionId_key" ON "AccessKeyPermission"("accessKeyId", "permissionId");
CREATE UNIQUE INDEX "UserAccessKey_userId_accessKeyId_key" ON "UserAccessKey"("userId", "accessKeyId");

-- Update Permission table to reference AccessKeyPermission
-- (No changes needed as foreign keys are already updated above)
