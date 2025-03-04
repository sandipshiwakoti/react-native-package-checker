import { useQuery } from '@tanstack/react-query';
import { checkPackages } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function usePackages(packages: string[]) {
  return useQuery({
    queryKey: queryKeys.packages.list(packages),
    queryFn: () => checkPackages(packages),
    enabled: packages.length > 0,
  });
}
