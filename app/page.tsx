'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Footer } from '@/components/common/footer';
import { Logo } from '@/components/common/logo';
import { PackageUploader } from '@/components/common/package-uploader';
import { GithubIcon } from '@/components/icons/github';
import { Input } from '@/components/ui/input';
import { externalUrls } from '@/config/urls';

export default function HomePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-center items-center sm:justify-end m-2">
        <Link
          href={externalUrls.github.rnpc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full 
          bg-secondary/10 hover:bg-secondary/20 text-muted-foreground/70 
          hover:text-muted-foreground transition-all text-md sm:text-xl"
        >
          <GithubIcon className="h-5 w-5 sm:h-7 sm:w-7" />
          <span>View on GitHub</span>
        </Link>
      </div>
      <div className="flex-1 max-w-[900px] mx-auto flex items-center justify-center">
        <div className="w-full px-4 py-10">
          <div className="text-center space-y-6">
            <Logo variant="vertical" size="large" />
            <p className="sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Check your React Native packages for New Architecture compatibility in seconds ⚡️
            </p>
          </div>
          <div className="w-full space-y-8 max-w-2xl mx-auto mt-4">
            <div className="relative group">
              <Input
                ref={inputRef}
                placeholder="Search packages (e.g. react-native-reanimated, react-native-svg)"
                className="h-14 sm:text-lg rounded-xl pr-12 pl-4 transition-all 
                shadow-sm hover:shadow-md
                focus:ring-2 focus:ring-primary/20 focus:shadow-lg
                bg-white/50 backdrop-blur-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (inputRef.current) {
                    handleSearch(inputRef.current.value);
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground/70"
              >
                <Search className="h-6 w-6" />
              </button>
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
