// ClientPagination.tsx
'use client';

import { useState } from 'react';
import {Pagination} from '../Pagination';
import { useUrlUpdate } from '@/hooks/useUrlUpdate';

export default function ClientPagination({ activePage,pageCount,pageHandler }: { activePage:number,pageCount: number,pageHandler:(page:number) => void, }) {

  
  return (
    <Pagination
      activePage={activePage}
      onPageChange={pageHandler}
      pageCount={pageCount}
    />
  );
}
