import { Opportunity, OpportunityVisibility } from '@prisma/client';

export const isOpportunityValidToInvite = (opportunity: Opportunity) => {
  return (
    !opportunity.banned &&
    opportunity.visibility !== OpportunityVisibility.nobody &&
    opportunity.applicationDeadline.getTime() >= Date.now()
  );
};
