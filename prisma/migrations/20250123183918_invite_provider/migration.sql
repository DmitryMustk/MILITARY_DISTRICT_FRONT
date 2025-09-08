-- CreateTable
CREATE TABLE "invite_provider" (
    "id" VARCHAR(50) NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_provider_pkey" PRIMARY KEY ("id")
);
