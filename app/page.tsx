'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { ExtensionPromoBanner } from '@/components/common/extension-promo-banner';
import { Footer } from '@/components/common/footer';
import { Logo } from '@/components/common/logo';
import { PackageJsonPaster } from '@/components/common/package-json-paster';
import { PackageUploader } from '@/components/common/package-uploader';
import { VSCodeExtensionBanner } from '@/components/common/vscode-extension-banner';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';

const RepositoryLink = dynamic(() => import('@/components/common/repository-link'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const goToCheckPage = (packageNames: string[]) => {
    router.push(`/check?packages=${packageNames.join(',')}`);
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
      <div className="flex justify-end items-center gap-2 m-4">
        <ThemeToggle />
        <RepositoryLink />
      </div>
      <div className="flex-1 max-w-[900px] mx-auto flex items-center justify-center">
        <div className="w-full px-4 py-6">
          <div className="text-center flex flex-col gap-6">
            <div className="relative">
              <div className="mb-6 absolute -top-22 left-1/2 transform -translate-x-1/2 w-full max-w-[900px] mx-auto sm:max-w-none hidden sm:block">
                <VSCodeExtensionBanner />
              </div>
              <div className="mt-3">
                <Logo variant="vertical" size="large" />
                <ExtensionPromoBanner />
              </div>
            </div>
            <p className="sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Check your React Native packages for New Architecture compatibility in seconds ⚡️
            </p>
          </div>
          <div className="w-full flex flex-col gap-8 max-w-2xl mx-auto mt-4">
            <div className="relative group">
              <Input
                ref={inputRef}
                placeholder="Search packages (e.g. react-native-reanimated, react-native-svg)"
                className="h-14 sm:text-lg rounded-xl pr-12 pl-4 transition-all 
                shadow-sm hover:shadow-md
                focus:ring-2 focus:ring-primary/20 focus:shadow-lg
                bg-background/50 dark:bg-secondary/10 backdrop-blur-xs"
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <PackageJsonPaster onPackagesFound={goToCheckPage} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
