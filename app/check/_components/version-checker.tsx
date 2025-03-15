import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpCircle } from 'lucide-react';
import { X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { externalUrls } from '@/config/urls';
import { getNormalizedVersion } from '@/lib/helpers';

interface VersionCheckerProps {
  versions: string[];
}

export function VersionChecker({ versions }: VersionCheckerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const searchParams = useSearchParams();
  const currentVersionParam = getNormalizedVersion(searchParams.get('version'));
  const currentVersion = versions?.includes(currentVersionParam ?? '') ? currentVersionParam : null;
  const latestVersion = versions[0];

  if (!currentVersion || !latestVersion || currentVersion === latestVersion || !isVisible) {
    return null;
  }

  const upgradeUrl = externalUrls.tools.upgradeHelper(currentVersion, latestVersion);

  return (
    <Alert
      className="mt-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 
      dark:from-indigo-900/20 dark:to-purple-900/10 border-l-4 border-l-indigo-400 dark:border-l-indigo-500"
    >
      <div className="flex justify-between">
        <div className="flex gap-3 flex-1">
          <ArrowUpCircle className="h-6 w-6 text-indigo-400 dark:text-indigo-500" />
          <div className="space-y-1 flex-1">
            <div className="flex items-start justify-between">
              <AlertTitle className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                React Native Update Available
              </AlertTitle>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              </button>
            </div>
            <AlertDescription className="sm:text-lg gap-2 text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center">
              <div>
                You&apos;re currently using React Native
                <span className="px-1 py-0.5 bg-slate-100 dark:bg-slate-900/50 rounded-md font-bold text-slate-700 dark:text-slate-200">
                  v{currentVersion}
                </span>
                . Version{' '}
                <span className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-md font-bold text-indigo-600 dark:text-indigo-400">
                  {latestVersion}
                </span>{' '}
                is now available with new features and improvements.
              </div>
              <Button variant="default" size="sm" asChild>
                <a
                  href={upgradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Upgrade Guide
                  <ArrowUpCircle className="h-4 w-4" />
                </a>
              </Button>
            </AlertDescription>
          </div>
        </div>
      </div>
    </Alert>
  );
}
