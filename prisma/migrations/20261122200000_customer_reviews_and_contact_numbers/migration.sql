CREATE TABLE "CustomerReview" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CustomerReview_createdAt_idx" ON "CustomerReview"("createdAt");

UPDATE "SiteSetting"
SET "value" = CASE "key"
    WHEN 'phone' THEN '0770341970'
    WHEN 'whatsappNumber' THEN '070 646 5477'
END
WHERE "key" IN ('phone', 'whatsappNumber')
  AND EXISTS (
    SELECT 1 FROM "SiteSetting"
    WHERE "key" = 'phone' AND regexp_replace("value", '[^0-9]', '', 'g') = '0706465477'
  )
  AND EXISTS (
    SELECT 1 FROM "SiteSetting"
    WHERE "key" = 'whatsappNumber' AND regexp_replace("value", '[^0-9]', '', 'g') = '0770341970'
  );
