/*
  Warnings:

  - You are about to drop the `invite_provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "invite_provider";

-- CreateTable
CREATE TABLE "invite_user" (
    "id" VARCHAR(50) NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR(512),
    "roles" "Role"[],

    CONSTRAINT "invite_user_pkey" PRIMARY KEY ("id")
);
