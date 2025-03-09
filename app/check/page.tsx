'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Overview } from '@/app/check/_components/overview';
import { PackageResults } from '@/app/check/_components/package-results';
import { VersionChecker } from '@/app/check/_components/version-checker';
import { Footer } from '@/components/common/footer';
import { LoadingIndicator } from '@/components/common/loading-indicator';
import { Logo } from '@/components/common/logo';
import { UploadButton } from '@/components/common/upload-button';
import { GithubIcon } from '@/components/icons/github';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { externalUrls } from '@/config/urls';
import { usePackages } from '@/hooks/queries/use-packages';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const { data, isLoading, error } = usePackages(selectedPackages);

  useEffect(() => {
    const packagesParam = searchParams?.get('packages');
    if (!packagesParam) {
      router.push('/');
      return;
    }
    const packages = packagesParam.split(',').filter(Boolean);
    if (packages.length === 0) {
      router.push('/');
      return;
    }
    setSelectedPackages(packages);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1200px] mx-auto px-4 w-full flex-1 flex flex-col">
        <div className="pt-4 pb-2 border-b mb-2 w-full">
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="flex-1 flex items-center justify-end gap-3 min-w-[200px]">
              <UploadButton />
              <Link
                href={externalUrls.github.rnpc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 px-4 rounded-md border 
                  hover:bg-secondary/10 text-muted-foreground/70 
                  hover:text-muted-foreground transition-all"
                aria-label="View source on GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {Object.keys(data?.results ?? {}).length === 0 || isLoading ? (
            <LoadingIndicator />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : (
            <div className="w-full">
              <VersionChecker versions={data?.reactNativeVersions ?? []} />
              <div className="min-h-screen flex flex-col space-y-6">
                <Overview data={data?.results} />
                <PackageResults data={data?.results} />
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
