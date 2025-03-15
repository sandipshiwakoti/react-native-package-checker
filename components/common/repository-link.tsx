'use client';

import Link from 'next/link';

import { GithubIcon } from '@/components/icons/github';
import { externalUrls } from '@/config/urls';

export function RepositoryLink() {
  return (
    <Link
      href={externalUrls.github.rnpc}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center h-10 w-14 rounded-md border 
        hover:bg-secondary/10 text-muted-foreground/70 
        hover:text-muted-foreground transition-all"
      aria-label="View project repository on GitHub"
    >
      <GithubIcon className="h-5 w-5" />
    </Link>
  );
}
