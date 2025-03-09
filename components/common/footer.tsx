import { HeartIcon } from 'lucide-react';

import { externalUrls } from '@/config/urls';

export function Footer() {
  return (
    <div className="text-center py-6 text-sm mt-2 text-muted-foreground border-t">
      <div className="space-y-2 text-center">
        <p className="flex items-center justify-center gap-1.5">
          Data sourced from{' '}
          <a
            href={externalUrls.github.directory}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-0.5 font-medium"
          >
            React Native Directory
          </a>
          <HeartIcon className="h-3.5 w-3.5 text-primary" />
        </p>
        <p className="text-xs text-muted-foreground/80 mx-auto">
          Built for the React Native community. We don&apos;t store any of your package.json data.
        </p>
      </div>
    </div>
  );
}
