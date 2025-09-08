-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('LINK', 'FILE');

-- CreateTable
CREATE TABLE "guides" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "resource" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "author_id" INTEGER,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
