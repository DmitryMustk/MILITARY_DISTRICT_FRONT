-- DropForeignKey
ALTER TABLE "opportunities" DROP CONSTRAINT "opportunities_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "opportunity_applications" DROP CONSTRAINT "opportunity_applications_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "opportunity_applications" DROP CONSTRAINT "opportunity_applications_opportunity_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_provider_id_fkey";

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
