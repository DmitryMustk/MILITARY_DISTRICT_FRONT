import { Artist } from '@prisma/client';

export type OpportunityInviteFormItem = {
  artist: Artist;
  message: string;
};
