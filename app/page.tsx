'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Footer } from '@/components/common/footer';
import { Logo } from '@/components/common/logo';
import { PackageUploader } from '@/components/common/package-uploader';
import { Input } from '@/components/ui/input';

export default function HomePage() {
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
    <div className="max-w-[900px] mx-auto min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full px-4 py-10">
          <div className="text-center space-y-6">
            <Logo variant="vertical" size="large" />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Is your React Native app ready for the New Architecture? Check all your packages at
              once.
            </p>
          </div>
          <div className="w-full space-y-8 max-w-2xl mx-auto mt-4">
            <div className="relative group">
              <Input
                placeholder="Search packages (e.g. react-native-reanimated)"
                className="h-14 text-lg rounded-xl pl-12 pr-4 transition-all 
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
