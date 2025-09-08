import 'next-auth';
import { Role } from '@prisma/client';

type InternalUser = {
  id: number;
  artistId: number | undefined;
  providerId: number | undefined;
  moderatorId: number | undefined;
  role: Role[];
  oauthExternalId?: string;
};

declare module 'next-auth' {
  interface Session {
    user?: InternalUser;
    oauthExternalId?: string;
  }

  type User = InternalUser;
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: InternalUser;
    oauthExternalId?: string;
  }
}
