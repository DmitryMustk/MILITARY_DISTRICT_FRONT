'use client';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Opportunity } from '@prisma/client';

interface OpportunityCardHeaderProps {
  opportunity: Opportunity;
}

export function OpportunityCardHeader({ opportunity }: OpportunityCardHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex gap-4 items-center">
        <div className="space-y-2">
          <div>{opportunity.title}</div>
          <p className="flex gap-2 items-center text-base text-muted-foreground font-archivo">
            {opportunity.description}
          </p>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
