import { Opportunity } from '@prisma/client';

export type Step = 'first' | 'second';

export type ArtistOpportunityInviteFormItem = {
  opportunity: Opportunity;
  message: string;
};
