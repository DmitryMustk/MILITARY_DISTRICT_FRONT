/*
  Warnings:

  - You are about to drop the column `project_category` on the `projects` table. All the data in the column will be lost.
  - Added the required column `budget` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reach` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "project_category",
ADD COLUMN     "budget" INTEGER NOT NULL,
ADD COLUMN     "reach" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ProjectCategory";

-- CreateIndex
CREATE INDEX "projects_budget_idx" ON "projects"("budget");

-- CreateIndex
CREATE INDEX "projects_reach_idx" ON "projects"("reach");
