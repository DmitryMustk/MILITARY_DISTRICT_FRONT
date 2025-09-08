import { getServerSession, NextAuthOptions, Session, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma/client';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { forbidden } from 'next/navigation';
import GoogleProvider from 'next-auth/providers/google';
import { randomUUID } from 'crypto';
import { OAuthProviderType, OUauthExternalId } from './oauth-external-id';
import { getTranslations } from 'next-intl/server';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: { params: { scope: 'profile email openid' } },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        artistId: undefined,
        providerId: undefined,
        moderatorId: undefined,
        role: [],
      }),
      wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials && credentials.username && credentials.password) {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            include: {
              artist: {
                select: {
                  id: true,
                },
              },
              provider: {
                select: { id: true },
              },
              moderator: {
                select: { id: true },
              },
            },
          });

          // Non OAuth user must have password != null and oauthExternalId == null
          if (!user?.password || user.oauthExternalId) {
            return null;
          }

          if (user && !user.locked && bcrypt.compareSync(credentials.password, user.password)) {
            return {
              id: user.id,
              artistId: user.artist?.id,
              providerId: user.provider?.id,
              moderatorId: user.moderator?.id,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    maxAge: 12 * 24 * 3600,
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      const t = await getTranslations('Action.signIn');
      if (account?.type !== 'oauth') {
        return true;
      }

      /* eslint-disable @typescript-eslint/no-explicit-any */
      if (account?.provider === 'google' && !(profile as any).email_verified) {
        throw new Error(t('unverifiedEmail'));
      }

      const oauthExternalId = new OUauthExternalId(account.provider as OAuthProviderType, user.id).toString();

      // Check if the user exists, if not then look for an invite, otherwise create an invite.
      const savedUser = await prisma.user.findUnique({
        where: { oauthExternalId: oauthExternalId },
      });
      if (savedUser) {
        return true;
      }

      const inviteByExternalId = await prisma.inviteArtist.findUnique({ where: { oauthExternalId: oauthExternalId } });
      if (inviteByExternalId) {
        return true;
      }

      if (!user.email) {
        throw new Error(t('emptyEmail'));
      }

      const inviteByEmail = await prisma.inviteArtist.findUnique({ where: { email: user.email } });
      if (inviteByEmail) {
        await prisma.inviteArtist.update({
          where: {
            email: user.email,
          },
          data: {
            oauthExternalId: oauthExternalId,
          },
        });
      } else {
        await prisma.inviteArtist.create({
          data: {
            email: user.email,
            oauthExternalId: oauthExternalId,
            id: randomUUID(),
            sentAt: new Date(),
          },
        });
      }

      return true;
    },
    async session({ session, token }) {
      const oauthExternalId = token.oauthExternalId;
      const user = oauthExternalId
        ? await prisma.user.findUnique({
            where: { oauthExternalId: oauthExternalId },
            include: { artist: true, provider: true, moderator: true },
          })
        : await prisma.user.findUnique({
            where: { id: token.user.id },
            include: { artist: true, provider: true, moderator: true },
          });

      if (!user && oauthExternalId) {
        // If the user sign in with oauth before full registration.
        return { ...session, user: undefined, oauthExternalId: oauthExternalId };
      }
      if (!user || user.locked) {
        forbidden(); // TODO: IMPROVE
      }

      if (oauthExternalId) {
        return {
          ...session,
          user: {
            id: user.id,
            artistId: user.artist?.id,
            providerId: user.provider?.id,
            moderatorId: user.moderator?.id,
            role: user.role,
            oauthExternalId: oauthExternalId,
          },
        };
      }

      session.user = token.user;

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user as unknown as User;
      }
      if (account?.type === 'oauth') {
        token.oauthExternalId = new OUauthExternalId(account.provider as OAuthProviderType, user.id).toString();
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/auth-error',
  },
};

// Use it in server contexts
export function auth(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
): Promise<Session | null> {
  return getServerSession(...args, authOptions);
}
