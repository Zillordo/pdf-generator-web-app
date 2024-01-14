-- CreateTable
CREATE TABLE "PdfFiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "base64Preview" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "allowedNumberOfFiles" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
