-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "soldAt" DATETIME,
    "images" TEXT,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT,
    "rating" REAL,
    "specifications" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "discount" REAL,
    "tags" TEXT,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("buyerId", "category", "createdAt", "deletedAt", "description", "discount", "id", "images", "isDeleted", "isFeatured", "isSold", "name", "price", "rating", "sellerId", "soldAt", "specifications", "tags", "updatedAt") SELECT "buyerId", "category", "createdAt", "deletedAt", "description", "discount", "id", "images", "isDeleted", "isFeatured", "isSold", "name", "price", "rating", "sellerId", "soldAt", "specifications", "tags", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
