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
         dark:text-primary-foreground/90 bg-background hover:bg-accent dark:hover:text-primary-foreground dark:bg-transparent dark:hover:bg-accent/20 dark:hover:border-accent/50 transition-all"
      aria-label="View project repository on GitHub"
    >
      <GithubIcon className="h-5 w-5" />
    </Link>
  );
}
