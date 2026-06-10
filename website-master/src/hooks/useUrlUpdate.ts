'use client';
import { useCallback } from 'react';
import queryString from 'query-string';
import { useRouter,usePathname } from 'next/navigation';

export const useUrlUpdate = () => {
  const {
    replace,
  } = useRouter();
  const pathname = usePathname();
  const updateUrl = useCallback((key:string, value:any) => {
    const params = queryString.parse(location.search, { arrayFormat: 'comma' });
    const newQueryParams = {
      ...params,
      [key]: value,
    };
    // if (!value) delete newQueryParams[key];
    const stringify = queryString.stringify(newQueryParams, { arrayFormat: 'comma' });
    replace(`${pathname}?${stringify}`,{scroll:false,});
  }, []);
  const updateMultiple = useCallback((updates: Record<string, any>) => {
    const params = queryString.parse(location.search, { arrayFormat: 'comma' });
    const newQueryParams = {
      ...params,
      ...updates,
    };
    const stringify = queryString.stringify(newQueryParams, { arrayFormat: 'comma' });
    replace(`${pathname}?${stringify}`,{scroll:false,});
  }, [replace, pathname]);

  return { updateUrl, updateMultiple };
};
