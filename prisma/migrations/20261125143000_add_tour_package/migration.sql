CREATE TABLE "TourPackage" (
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "destinations" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "heroImageUrl" TEXT NOT NULL,
    "gallery" JSONB NOT NULL,
    "itinerary" JSONB NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB NOT NULL,
    "vehicles" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourPackage_pkey" PRIMARY KEY ("key")
);
