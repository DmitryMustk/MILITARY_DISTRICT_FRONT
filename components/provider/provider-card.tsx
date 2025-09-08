import { Provider } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

interface CardProps extends PropsWithChildren {
  provider: Provider;
}

export const ProviderCard = ({ provider, children }: CardProps) => {
  const t = useTranslations('Component.ProviderCard');
  //const tIndustry = useTranslations('Enum.Industry');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{provider.organizationName}</CardTitle>
        <CardDescription>{provider.representativeName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {provider.website && (
          <Link href={provider.website} target="_blank" className="underline">
            {provider.website}
          </Link>
        )}
        {provider.information && (
          <div>
            <h3 className="font-semibold">{t('information')}</h3>
            <p>{provider.information}</p>
          </div>
        )}
        {provider.phone && (
          <div>
            <h3 className="font-semibold">{t('phone')}</h3>
            <p>{provider.phone}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
};
