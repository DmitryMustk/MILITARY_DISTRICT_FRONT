-- DropIndex
DROP INDEX "artists_industry_idx";

-- DropIndex
DROP INDEX "artists_languages_idx";

-- DropIndex
DROP INDEX "artists_theme_idx";

-- DropIndex
DROP INDEX "projects_tags_idx";

-- CreateIndex
CREATE INDEX "artists_languages_idx" ON "artists" USING GIN ("languages");

-- CreateIndex
CREATE INDEX "artists_theme_idx" ON "artists" USING GIN ("theme");

-- CreateIndex
CREATE INDEX "artists_industry_idx" ON "artists" USING GIN ("industry");

-- CreateIndex
CREATE INDEX "opportunities_min_amount_idx" ON "opportunities"("min_amount");

-- CreateIndex
CREATE INDEX "opportunities_max_amount_idx" ON "opportunities"("max_amount");

-- CreateIndex
CREATE INDEX "opportunities_legal_status_idx" ON "opportunities" USING GIN ("legal_status");

-- CreateIndex
CREATE INDEX "opportunities_min_age_idx" ON "opportunities"("min_age");

-- CreateIndex
CREATE INDEX "opportunities_max_age_idx" ON "opportunities"("max_age");

-- CreateIndex
CREATE INDEX "opportunities_gender_idx" ON "opportunities" USING GIN ("gender");

-- CreateIndex
CREATE INDEX "opportunities_industry_idx" ON "opportunities" USING GIN ("industry");

-- CreateIndex
CREATE INDEX "opportunities_country_residence_idx" ON "opportunities" USING GIN ("country_residence");

-- CreateIndex
CREATE INDEX "opportunities_country_citizenship_idx" ON "opportunities" USING GIN ("country_citizenship");

-- CreateIndex
CREATE INDEX "opportunities_theme_idx" ON "opportunities" USING GIN ("theme");

-- CreateIndex
CREATE INDEX "projects_tags_idx" ON "projects" USING GIN ("tags");
