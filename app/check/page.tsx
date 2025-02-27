'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PackageResults } from '@/components/package-results';
import { PackageUploadModal } from '@/components/package-upload-modal';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Archive,
  CheckCircle,
  Filter,
  Package2,
  UploadIcon,
  X,
  XCircle,
} from 'lucide-react';
import { PackageFilter } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { cn } from '../../lib/utils';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packagesParam = searchParams?.get('packages');
  const packages = packagesParam?.split(',').filter(Boolean) || [];
  const [activeFilter, setActiveFilter] = useState<PackageFilter>('all');
  const [showPreview, setShowPreview] = useState(false);

  if (packages.length === 0) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="py-6 border-b mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Package Analysis</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground">
                  {packages.length} package{packages.length > 1 ? 's' : ''} selected
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(true)}
                  className="text-sm text-muted-foreground hover:text-foreground gap-2"
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload Packages
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                  activeFilter !== 'all' ? 'bg-muted' : 'text-muted-foreground'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {activeFilter !== 'all' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setActiveFilter('all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Select
                value={activeFilter}
                onValueChange={val => setActiveFilter(val as PackageFilter)}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Package2 className="h-4 w-4" />
                      <span>All</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="supported">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Supported New Architecture</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="unsupported">
                    <span className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Unsupported New Architecture</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="untested">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Untested</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="unmaintained">
                    <span className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-amber-500" />
                      <span>Unmaintained</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <PackageResults packages={packages} activeFilter={activeFilter} />
        <PackageUploadModal
          open={showPreview}
          onOpenChange={setShowPreview}
          defaultPackages={packages}
          onAnalyze={selectedPackages => {
            setShowPreview(false);
            if (selectedPackages.length > 0) {
              router.push(`/check?packages=${selectedPackages.join(',')}`);
            } else {
              router.push('/');
            }
          }}
        />
      </div>
    </div>
  );
}
