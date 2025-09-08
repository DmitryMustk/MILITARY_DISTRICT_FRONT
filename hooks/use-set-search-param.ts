import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSetParam(notReload?: boolean) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const paramsReadonly = useSearchParams();
  const paramsNotReadonly = useMemo(() => new URLSearchParams(paramsReadonly), [paramsReadonly]);

  return useCallback(
    (str: string | undefined, urlParamName: string) => {
      const params = paramsNotReadonly;
      params.delete('page');
      if (str) {
        params.set(urlParamName, str);
      } else {
        params.delete(urlParamName);
      }
      const url = `${pathname}?${params.toString()}`;
      if (notReload) {
        window.history.pushState(null, '', url);
      } else {
        replace(url);
      }
    },
    [paramsNotReadonly, pathname, replace, notReload]
  );
}
