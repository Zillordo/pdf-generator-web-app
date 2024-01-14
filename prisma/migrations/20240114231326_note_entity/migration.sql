/*
  Warnings:

  - You are about to drop the column `userId` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Files` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "allowedNumberOfFiles" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("allowedNumberOfFiles", "id", "updatedAt") SELECT "allowedNumberOfFiles", "id", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE TABLE "new_Files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "base64Preview" TEXT NOT NULL
);
INSERT INTO "new_Files" ("base64Preview", "date", "id", "name", "path") SELECT "base64Preview", "date", "id", "name", "path" FROM "Files";
DROP TABLE "Files";
ALTER TABLE "new_Files" RENAME TO "Files";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
