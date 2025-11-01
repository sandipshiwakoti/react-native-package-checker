import {
  Command,
  FileCode,
  Monitor,
  MonitorCog,
  MonitorSmartphone,
  Scale,
  Smartphone,
  Tablet,
  Wrench,
} from 'lucide-react';

import { ChromeIcon } from '@/components/icons/chrome';
import { TypeScriptIcon } from '@/components/icons/typescript';
import { Chip } from '@/components/ui/chip';
import { PackageInfo } from '@/types';

interface PackageFeaturesStatusProps {
  packageInfo: PackageInfo;
}

export const PackageFeaturesStatus = ({ packageInfo }: PackageFeaturesStatusProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {packageInfo.platforms?.ios && <Chip icon={Smartphone} label="iOS" variant="blue" />}
      {packageInfo.platforms?.android && <Chip icon={Tablet} label="Android" variant="green" />}
      {packageInfo.platforms?.web && <Chip icon={ChromeIcon} label="Web" variant="purple" />}
      {packageInfo.platforms?.windows && (
        <Chip icon={MonitorSmartphone} label="Windows" variant="slate" />
      )}
      {packageInfo.platforms?.macos && <Chip icon={Command} label="macOS" variant="slate" />}
      {packageInfo.platforms?.fireos && <Chip icon={Monitor} label="Fire OS" variant="amber" />}
      {packageInfo.platforms?.vegaos && (
        <Chip
          icon={MonitorCog}
          label="Vega OS"
          variant="green"
          href={
            packageInfo.platforms?.vegaos && typeof packageInfo.platforms.vegaos === 'string'
              ? `https://www.npmjs.com/package/${packageInfo.platforms.vegaos}`
              : undefined
          }
        />
      )}
      {packageInfo.support?.dev && <Chip icon={Wrench} label="Dev Tool" variant="slate" />}
      {packageInfo.support?.expoGo && <Chip icon={Smartphone} label="Expo Go" variant="slate" />}
      {packageInfo.support?.hasTypes && (
        <Chip icon={TypeScriptIcon} label="TypeScript" variant="slate" />
      )}
      {packageInfo.support?.hasNativeCode && (
        <Chip icon={FileCode} label="Native Code" variant="slate" />
      )}
      {packageInfo.support?.license && (
        <Chip
          icon={Scale}
          label={packageInfo.support.license}
          variant="slate"
          href={packageInfo.support.licenseUrl || '#'}
        />
      )}
      {packageInfo.isRecent && <Chip label="Recently Added" variant="slate" />}
    </div>
  );
};
