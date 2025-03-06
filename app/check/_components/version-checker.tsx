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
    <Alert className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
      <div className="flex justify-between">
        <div className="flex gap-3 flex-1">
          <ArrowUpCircle className="h-6 w-6 text-blue-500 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-start justify-between">
              <AlertTitle className="text-lg sm:text-xl font-semibold text-blue-700">
                React Native Update Available
              </AlertTitle>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-blue-600" />
              </button>
            </div>
            <AlertDescription className="sm:text-lg gap-2 text-slate-600 flex flex-col sm:flex-row items-start sm:items-center ">
              <div>
                You&apos;re currently using React Native
                <span className="px-1 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700">
                  v{currentVersion}
                </span>
                . Version{' '}
                <span className="px-1 py-0.5 bg-blue-100 rounded-md font-bold text-blue-700">
                  {latestVersion}
                </span>{' '}
                is now available with new features and improvements.
              </div>
              <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600" asChild>
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
