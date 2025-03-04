'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Footer } from '@/components/footer';
import { LoadingIndicator } from '@/components/loading-indicator';
import { Logo } from '@/components/logo';
import { PackageResults } from '@/components/package-results';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadButton } from '@/components/upload-button';
import { VersionChecker } from '@/components/version-checker';
import { externalUrls } from '@/config/urls';
import { usePackages } from '@/hooks/queries/use-packages';
import { NewArchFilter, PackageInfo } from '@/types';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);
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

  const results = useMemo(() => {
    if (!data) return {};

    const { archData, packageInfo } = data;
    const packages = packageInfo.packages;

    return selectedPackages.reduce<Record<string, PackageInfo>>((acc, pkg) => {
      if (packages[pkg]) {
        acc[pkg] = {
          ...(packages[pkg] || {
            npmUrl: externalUrls.npm.package(pkg),
            notInDirectory: true,
            error: 'Package not found in React Native Directory',
          }),
          newArchitecture: archData[pkg]?.newArchitecture,
          unmaintained: archData[pkg]?.unmaintained,
          error: archData[pkg]?.error,
        };
      }
      return acc;
    }, {});
  }, [data, selectedPackages]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1200px] mx-auto px-4 w-full flex-1 flex flex-col">
        <div className="pt-4 pb-2 border-b mb-2 w-full">
          <div className="flex w-full items-center justify-between">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <UploadButton />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {Object.keys(data?.packageInfo?.packages ?? {}).length === 0 || isLoading ? (
            <LoadingIndicator />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : (
            <div className="w-full">
              <VersionChecker versions={data?.packageInfo?.reactNativeVersions ?? []} />
              <PackageResults
                data={results}
                activeArchFilters={activeArchFilters}
                setActiveArchFilters={setActiveArchFilters}
                activeMaintenanceFilter={activeMaintenanceFilter}
                setActiveMaintenanceFilter={setActiveMaintenanceFilter}
                showUnmaintained={activeMaintenanceFilter}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
