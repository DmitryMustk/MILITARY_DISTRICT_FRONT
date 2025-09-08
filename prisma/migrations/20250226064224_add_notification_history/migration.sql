-- CreateTable
CREATE TABLE "opportunity_invite_notification_history" (
    "id" SERIAL NOT NULL,
    "opportunityInviteId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_invite_notification_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "opportunity_invite_notification_history" ADD CONSTRAINT "opportunity_invite_notification_history_opportunityInviteI_fkey" FOREIGN KEY ("opportunityInviteId") REFERENCES "opportunity_invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
