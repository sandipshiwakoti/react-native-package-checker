import { useQuery } from '@tanstack/react-query';

import { checkPackages } from '@/lib/api';
import { cleanPackageName } from '@/lib/helpers';
import { queryKeys } from '@/lib/query-keys';
import { PackageInfo } from '@/types';

export function usePackages(selectedPackages: string[]) {
  return useQuery({
    queryKey: queryKeys.packages.list(selectedPackages),
    queryFn: () => checkPackages(selectedPackages),
    select: data => {
      if (!data) return {};

      const { packageInfo } = data;
      const packages = packageInfo.packages;
      const cleanedPackages = selectedPackages.map(item => cleanPackageName(item));
      const results = cleanedPackages.reduce<Record<string, PackageInfo>>((acc, pkg) => {
        if (packages[pkg]) {
          acc[pkg] = {
            ...packages[pkg],
          };
        }
        return acc;
      }, {});

      return { results, reactNativeVersions: data.packageInfo.reactNativeVersions };
    },
    enabled: selectedPackages.length > 0,
  });
}
