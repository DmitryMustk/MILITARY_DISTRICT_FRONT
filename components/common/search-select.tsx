'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Option } from '@/components/ui/multi-select';
import { useSearchParams } from 'next/navigation';
import { useSetParam } from '@/hooks/use-set-search-param';
import { useCallback } from 'react';

interface SearchSelectProps {
  paramName: string;
  options: Option[];
  placeholder?: string;
  resetPagination?: boolean;
}

export function SearchSelect({ paramName, options, placeholder, resetPagination = false }: SearchSelectProps) {
  const searchParams = useSearchParams();
  const search = useSetParam();

  const value = searchParams.get(paramName) || '-';

  const handleValueChange = useCallback(
    (value: string) => {
      search(value !== '-' ? value : undefined, paramName);
      if (resetPagination) {
        search(``, `page`);
      }
    },
    [paramName, resetPagination, search]
  );

  return (
    <div className="flex">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {!!placeholder && <SelectItem value={'-'}>{placeholder}</SelectItem>}
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
