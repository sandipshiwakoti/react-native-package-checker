'use client';

import Link from 'next/link';

import { GithubIcon } from '@/components/icons/github';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { externalUrls } from '@/config/urls';

export function RepositoryLink() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={externalUrls.github.rnpc}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-10 w-14 rounded-md border 
               dark:text-primary-foreground/90 bg-background hover:bg-accent dark:hover:text-primary-foreground dark:bg-transparent dark:hover:bg-accent/20 dark:hover:border-accent/50 transition-all"
          >
            <GithubIcon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="w-35">View on GitHub</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
