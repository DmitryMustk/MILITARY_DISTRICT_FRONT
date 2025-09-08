'use client';

import React, { useCallback, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormFieldInput } from '@/components/ui/form-field';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Form, FormErrorMessage, FormFooter } from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import { clearUrlHomePage } from '@/lib/user/action';
import { getUrlHomePage, getUserRolesByUsername } from '@/lib/user/queries';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export const signInFormSchema = (t: ReturnType<typeof useTranslations<'Zod.signInFormSchema'>>) =>
  z.object({
    username: z.string().min(1, t('usernameRequired')),
    password: z.string().min(1, t('passwordRequired')),
  });

export type SigninFormValues = z.infer<ReturnType<typeof signInFormSchema>>;

interface SignInFormProps {
  prevUrlPathname: string;
}

export const SignInForm = ({ prevUrlPathname }: SignInFormProps) => {
  const t = useTranslations('Component.SignInForm');
  const zodTranslation = useTranslations('Zod.signInFormSchema');
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const onSubmit = useCallback(
    (values: SigninFormValues) => {
      startTransition(async () => {
        const urlHomePage = (await getUrlHomePage(values.username))?.urlHomePage;
        const result = await signIn('credentials', {
          ...values,
          redirect: false,
        });

        setError(result?.ok ? undefined : t('invalidUsernamePassword'));
        if (!result?.ok) {
          return;
        }

        toast({ title: t('successfullyAuthenticated') });
        if (urlHomePage) {
          await clearUrlHomePage(values.username);
        }
        const res = await getUserRolesByUsername(values.username);
        if (res?.role.includes('ADMINISTRATOR')) {
          router.push('/admin/dashboard');
        } else {
          router.push(urlHomePage ?? prevUrlPathname);
        }
        router.refresh();
      });
    },
    [t, router, prevUrlPathname, toast]
  );

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signInFormSchema(zodTranslation)),
    defaultValues: { username: '', password: '' },
  });

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormFieldInput control={form.control} name="username" label={t('username')} />
        <FormFieldInput control={form.control} name="password" label={t('password')} type="password" />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <Link
          href="/user/forgot-password"
          className="!mt-1 flex justify-end text-sm text-neutral-gray hover:text-gray-900 transition"
        >
          {t('forgotPassword')}
        </Link>
        <FormFooter>
          <Button className="w-full" disabled={pending} type="submit">
            {t('signIn')}
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};
