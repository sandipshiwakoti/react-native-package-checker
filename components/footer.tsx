import { HeartIcon } from 'lucide-react';
import { externalUrls } from '../config/urls';

export function Footer() {
  return (
    <div className="text-center py-6 text-sm mt-2 text-muted-foreground border-t space-y-2">
      <p className="flex items-center justify-center gap-1">
        Data sourced from{' '}
        <a
          href={externalUrls.github.directory}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-0.5"
        >
          React Native Directory
        </a>
        <HeartIcon className="h-4 w-4" />
      </p>
      <p className="text-xs text-muted-foreground/80">
        We don&apos;t store any of your package.json data. This tool is purely for helping the React
        Native community.
      </p>
    </div>
  );
}
