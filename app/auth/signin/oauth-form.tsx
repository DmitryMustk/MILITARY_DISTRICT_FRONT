'use client';

import { signIn } from 'next-auth/react';
import { useCallback, useTransition } from 'react';
import GoogleIcon from '../../../public/images/google.svg';
import FacebookIcon from '../../../public/images/facebook.svg';
import LinkedinIcon from '../../../public/images/linkedin.svg';

export const OAuthForm = () => {
  const [pendingGoogle, startTransitionGoogle] = useTransition();
  const [pendingFacebook, startTransitionFacebook] = useTransition();
  const [pendingLinkedin, startTransitionLinkedin] = useTransition();
  const handleGoogleSignIn = useCallback(() => {
    startTransitionGoogle(async () => {
      await signIn('google', { callbackUrl: '/artist/registration-oauth' }, { prompt: 'login' });
    });
  }, []);

  const handleFacebookSignIn = useCallback(() => {
    startTransitionFacebook(async () => {
      await signIn('facebook', { callbackUrl: '/artist/registration-oauth' }, { prompt: 'login' });
    });
  }, []);

  const handleLinkedinSignIn = useCallback(() => {
    startTransitionLinkedin(async () => {
      await signIn('linkedin', { callbackUrl: '/artist/registration-oauth' }, { prompt: 'login' });
    });
  }, []);

  return (
    <>
      <div className="flex justify-center gap-3">
        <GoogleIcon disabled={pendingGoogle} onClick={handleGoogleSignIn} className="w-8 cursor-pointer" />
        <FacebookIcon disabled={pendingFacebook} onClick={handleFacebookSignIn} className="w-8 cursor-pointer" />
        <LinkedinIcon disabled={pendingLinkedin} onClick={handleLinkedinSignIn} className="w-8 cursor-pointer" />
      </div>
    </>
  );
};
