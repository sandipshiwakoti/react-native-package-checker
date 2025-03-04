'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { PackageUploader } from './package-uploader';

export function PackageSearch() {
  const router = useRouter();

  const goToCheckPage = (packageNames: string[], rnVersion?: string) => {
    const versionParam = rnVersion ? `&version=${rnVersion}` : '';
    router.push(`/check?packages=${packageNames.join(',')}${versionParam}`);
  };

  const handleSearch = (value: string) => {
    const packageNames = value
      .split(',')
      .map(name => name.trim())
      .filter(Boolean);
    if (packageNames.length > 0) {
      goToCheckPage(packageNames);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto mt-4">
      <div>
        <div className="relative group">
          <Input
            placeholder="Search packages (e.g. react-native-reanimated)"
            className="h-14 text-lg pl-12 pr-4 transition-all 
                shadow-sm hover:shadow-md
                focus:ring-2 focus:ring-primary/20 focus:shadow-lg
                bg-white/50 backdrop-blur-sm"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(e.currentTarget.value);
              }
            }}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 
              text-muted-foreground/70 group-hover:text-muted-foreground/90"
          />
          <div className="absolute -bottom-6 left-4 text-xs text-muted-foreground/70">
            Tip: Enter multiple packages separated by commas
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <PackageUploader onPackagesFound={goToCheckPage} />
    </div>
  );
}
