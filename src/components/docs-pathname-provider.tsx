'use client';

import { FrameworkProvider, type Framework } from 'fumadocs-core/framework';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { getPublicPathname } from '../lib/i18n';

function usePublicPathname() {
  return getPublicPathname(usePathname());
}

export function DocsPathnameProvider({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider
      usePathname={usePublicPathname}
      useParams={useParams}
      useRouter={useRouter}
      // Use the same Next.js components as Fumadocs' NextProvider adapter.
      Link={Link as Framework['Link']}
      Image={Image as Framework['Image']}
    >
      {children}
    </FrameworkProvider>
  );
}
