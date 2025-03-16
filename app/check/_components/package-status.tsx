import React from 'react';
import { AlertCircle, Archive, CheckCircle, XCircle } from 'lucide-react';

import { Chip } from '@/components/ui/chip';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface PackageStatusProps {
  packageInfo: PackageInfo;
}

const newArchChipConfig = {
  supported: { icon: CheckCircle, label: 'New Architecture Supported', variant: 'green' },
  unsupported: { icon: XCircle, label: 'New Architecture Unsupported', variant: 'red' },
  untested: { icon: AlertCircle, label: 'New Architecture Untested', variant: 'yellow' },
} as const;

export const PackageStatus = ({ packageInfo }: PackageStatusProps) => {
  const renderNewArchStatus = (status: NewArchSupportStatus) => {
    const config = newArchChipConfig[status];
    return <Chip key={status} icon={config.icon} label={config.label} variant={config.variant} />;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {packageInfo.unmaintained && <Chip icon={Archive} label="Unmaintained" variant="amber" />}
      {packageInfo.newArchitecture && renderNewArchStatus(packageInfo.newArchitecture)}
      {packageInfo.platforms?.ios && <Chip label="iOS" variant="blue" />}
      {packageInfo.platforms?.android && <Chip label="Android" variant="green" />}
      {packageInfo.platforms?.web && <Chip label="Web" variant="purple" />}
      {packageInfo.support?.hasTypes && <Chip label="TypeScript" variant="slate" />}
      {packageInfo.support?.license && (
        <Chip
          label={packageInfo.support.license}
          variant="slate"
          href={packageInfo.support.licenseUrl || '#'}
        />
      )}
      {packageInfo.isRecent && <Chip label="Recently Added" variant="slate" />}
    </div>
  );
};
