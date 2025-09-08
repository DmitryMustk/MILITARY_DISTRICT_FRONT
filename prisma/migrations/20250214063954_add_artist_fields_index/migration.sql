-- CreateIndex
CREATE INDEX "artists_birth_day_idx" ON "artists"("birth_day");

-- CreateIndex
CREATE INDEX "artists_languages_idx" ON "artists"("languages");

-- CreateIndex
CREATE INDEX "artists_country_residence_idx" ON "artists"("country_residence");

-- CreateIndex
CREATE INDEX "artists_country_citizenship_idx" ON "artists"("country_citizenship");

-- CreateIndex
CREATE INDEX "artists_theme_idx" ON "artists"("theme");

-- CreateIndex
CREATE INDEX "artists_industry_idx" ON "artists"("industry");
