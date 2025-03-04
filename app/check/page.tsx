'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PackageResults } from '@/components/package-results';
import { NewArchFilter, PackageInfo } from '../../types';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Logo } from '../../components/logo';
import { UploadButton } from '../../components/upload-button';
import { LoadingIndicator } from '../../components/loading-indicator';
import { HeartIcon } from 'lucide-react';
import { VersionChecker } from '../../components/version-checker';
import Link from 'next/link';
import { Footer } from '../../components/footer';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reactNativeVersions, setReactNativeVersions] = useState([]);
  const [results, setResults] = useState<Record<string, PackageInfo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

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

  useEffect(() => {
    const checkPackages = async () => {
      try {
        setLoading(true);
        const archResponse = await fetch('/api/libraries/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ packages: selectedPackages }),
        });

        if (!archResponse.ok) {
          throw new Error('Failed to check new architecture support');
        }

        const archData = await archResponse.json();

        const infoResponse = await fetch('/api/package-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ packages: selectedPackages }),
        });

        if (!infoResponse.ok) {
          throw new Error('Failed to fetch package information');
        }

        const infoData = await infoResponse.json();
        const packages = infoData?.packages;

        setReactNativeVersions(infoData.reactNativeVersions);

        const mergedResults = selectedPackages.reduce<Record<string, PackageInfo>>((acc, pkg) => {
          if (packages[pkg]) {
            acc[pkg] = {
              ...(packages[pkg] || {
                npmUrl: `https://www.npmjs.com/package/${pkg}`,
                notInDirectory: true,
                error: 'Package not found in React Native Directory',
              }),
              newArchitecture: archData[pkg]?.newArchitecture,
              unmaintained: archData[pkg]?.unmaintained,
              error: archData[pkg]?.error,
              packageJson: archData[pkg]?.packageJson,
            };
          }
          return acc;
        }, {});
        setResults(mergedResults);
      } catch (e) {
        console.error('API Error:', e);
        setError(
          e instanceof Error
            ? `Failed to check packages: ${e.message}`
            : 'Connection failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedPackages.length > 0) {
      checkPackages();
    }
  }, [selectedPackages]);

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
          {Object.keys(results).length === 0 || loading ? (
            <LoadingIndicator />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="w-full">
              <VersionChecker versions={reactNativeVersions} />
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
