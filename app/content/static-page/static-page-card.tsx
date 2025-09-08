import { PropsWithChildren } from 'react';
import { StaticPage } from '@prisma/client';

type Prp = {
  page: StaticPage;
};

export function StaticPageCard({ page, children }: PropsWithChildren<Prp>) {
  return (
    <div key={page.id} className="flex flex-col flex-grow border border-primary max-w-96 h-full">
      <div className="flex flex-col gap-8 p-8 flex-grow">
        <h2 className="overflow-hidden text-ellipsis">/{page.slug}</h2>
        {page.title && <p className="text-sm text-muted-foreground">{page.title}</p>}
        {children}
      </div>
    </div>
  );
}
