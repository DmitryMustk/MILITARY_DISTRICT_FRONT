'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSetParam } from '@/hooks/use-set-search-param';

export type SearchPaginationSearchParams = {
  page?: string;
};

export type SearchPaginationProps = {
  currentPage: number;
  pagesTotal: number;
};

export function SearchPagination({ currentPage, pagesTotal }: SearchPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useSetParam();

  const getHrefForPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(`page`, page.toString());

    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    if (pagesTotal && currentPage > pagesTotal) {
      search(undefined, 'page');
    }
  }, [search, currentPage, pagesTotal]);

  if (pagesTotal < 2) {
    return;
  }

  return (
    <Pagination className="font-archivo-narrow">
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={getHrefForPage(currentPage - 1)} />
          </PaginationItem>
        )}

        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink href={getHrefForPage(1)}>1</PaginationLink>
          </PaginationItem>
        )}
        {currentPage > 3 && (
          <PaginationItem>
            {currentPage === 4 ? <PaginationLink href={getHrefForPage(2)}>2</PaginationLink> : <PaginationEllipsis />}
          </PaginationItem>
        )}

        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationLink href={getHrefForPage(currentPage - 1)}>{currentPage - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={getHrefForPage(currentPage)} isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage !== pagesTotal && (
          <PaginationItem>
            <PaginationLink href={getHrefForPage(currentPage + 1)}>{currentPage + 1}</PaginationLink>
          </PaginationItem>
        )}

        {currentPage < pagesTotal - 2 && (
          <PaginationItem>
            {currentPage === pagesTotal - 3 ? (
              <PaginationLink href={getHrefForPage(pagesTotal - 1)}>{pagesTotal - 1}</PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        )}
        {currentPage < pagesTotal - 1 && (
          <PaginationItem>
            <PaginationLink href={getHrefForPage(pagesTotal)}>{pagesTotal}</PaginationLink>
          </PaginationItem>
        )}

        {currentPage !== pagesTotal && (
          <PaginationItem>
            <PaginationNext href={getHrefForPage(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
