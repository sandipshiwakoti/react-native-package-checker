import DirectoryPackagesTabContent from '@/app/check/_components/directory-packages-tab-content';
import UnlistedPackagesTabContent from '@/app/check/_components/unlisted-packages-tab-content';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFilter } from '@/contexts/filter-context';
import { PackageInfo } from '@/types';

interface PackageResultsProps {
  data?: Record<string, PackageInfo>;
}

export function PackageResults({ data }: PackageResultsProps) {
  const { activeTab, setActiveTab } = useFilter();

  return (
    <div className="flex-1 py-2">
      <div className="flex flex-row justify-between">
        <HeadingWithInfo
          title="Results"
          tooltip="Analysis results of React Native packages showing compatibility status and metrics"
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="directory" className="flex items-center gap-1.5">
            Directory Packages
          </TabsTrigger>
          <TabsTrigger value="unlisted" className="flex items-center gap-1.5">
            Unlisted Packages
          </TabsTrigger>
        </TabsList>
        <TabsContent value="directory" className="p-0 m-0">
          <DirectoryPackagesTabContent data={data} />
        </TabsContent>
        <TabsContent value="unlisted" className="p-0 m-0">
          <UnlistedPackagesTabContent data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
