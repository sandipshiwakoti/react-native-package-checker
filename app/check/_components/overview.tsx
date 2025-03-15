import React, { useMemo } from 'react';
import { AlertCircle, Archive, CheckCircle, FileQuestion, XCircle } from 'lucide-react';

import { ExportButton } from '@/components/common/export-button';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFilter } from '@/contexts/filter-context';
import { prepareFileExportData } from '@/lib/file-export';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface OverviewProps {
  data?: Record<string, PackageInfo>;
}

interface OverviewCard {
  id: string;
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  tooltip: string;
  total: number;
  isActive?: boolean;
  onClick?: () => void;
}

function OverviewCard({
  id,
  title,
  value,
  icon,
  color,
  tooltip,
  total,
  isActive,
  onClick,
}: OverviewCard) {
  const colorClasses = {
    green: 'hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20',
    red: 'hover:bg-red-50/30 dark:hover:bg-red-900/20',
    yellow: 'hover:bg-amber-50/30 dark:hover:bg-amber-900/20',
    gray: 'hover:bg-slate-50/30 dark:hover:bg-slate-800/30',
    amber: 'hover:bg-amber-50/30 dark:hover:bg-amber-900/20',
  };

  const bgColorClasses = {
    green: 'bg-emerald-100/50 dark:bg-emerald-900/30',
    red: 'bg-red-100/50 dark:bg-red-900/30',
    yellow: 'bg-amber-100/50 dark:bg-amber-900/30',
    gray: 'bg-slate-100/50 dark:bg-slate-800/40',
    amber: 'bg-amber-100/50 dark:bg-amber-900/30',
  };

  const progressColorClasses = {
    green: 'bg-emerald-500/80 dark:bg-emerald-500/60',
    red: 'bg-red-500/80 dark:bg-red-500/60',
    yellow: 'bg-amber-500/80 dark:bg-amber-500/60',
    gray: 'bg-slate-500/80 dark:bg-slate-500/60',
    amber: 'bg-amber-500/80 dark:bg-amber-500/60',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`p-4 rounded-xl border border-border/80 bg-card/50 hover:border-primary/50 hover:bg-card/80 dark:border-border/70 dark:hover:border-primary/40 dark:hover:bg-card/60 transition-all duration-200 shadow-sm hover:shadow-md group relative cursor-pointer ${colorClasses[color as keyof typeof colorClasses]} ${isActive ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start gap-3">
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-3">
                  <div className="shrink-0">
                    <div
                      className={`p-2 rounded-full transition-colors ${bgColorClasses[color as keyof typeof bgColorClasses]}`}
                    >
                      {icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-muted-foreground">{title}</p>
                      {tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>{tooltip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-bold">{value}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${progressColorClasses[color as keyof typeof progressColorClasses]}`}
                            style={{ width: `${Math.max((value / total) * 100, 0)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {((value / total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {id === 'unlisted' ? 'Click to view unlisted packages' : `Click to filter ${id} packages`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Overview({ data = {} }: OverviewProps) {
  const { activeFilter, setActiveFilter, setActiveTab } = useFilter();

  const totalResultCounts = Object.keys(data).length;
  const fileExportData = prepareFileExportData(data);

  const overviewCards = useMemo(
    () => [
      {
        id: 'supported',
        title: 'Supported',
        value: Object.values(data).filter(
          pkg => pkg.newArchitecture === NewArchSupportStatus.Supported
        ).length,
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        color: 'green',
        tooltip: 'Packages that have confirmed support for the New Architecture',
        total: totalResultCounts,
      },
      {
        id: 'unsupported',
        title: 'Unsupported',
        value: Object.values(data).filter(
          pkg => pkg.newArchitecture === NewArchSupportStatus.Unsupported
        ).length,
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        color: 'red',
        tooltip: 'Packages that are known to not support the New Architecture',
        total: totalResultCounts,
      },
      {
        id: 'untested',
        title: 'Untested',
        value: Object.values(data).filter(
          pkg => pkg.newArchitecture === NewArchSupportStatus.Untested
        ).length,
        icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
        color: 'yellow',
        tooltip: 'Packages that have not been tested with the New Architecture',
        total: totalResultCounts,
      },
      {
        id: 'unlisted',
        title: 'Unlisted',
        value: Object.values(data).filter(pkg => pkg.notInDirectory).length,
        icon: <FileQuestion className="h-5 w-5 text-gray-600" />,
        color: 'gray',
        tooltip: 'Packages not listed in the official directory',
        total: totalResultCounts,
      },
      {
        id: 'unmaintained',
        title: 'Unmaintained',
        value: Object.values(data).filter(pkg => pkg.unmaintained).length,
        icon: <Archive className="h-5 w-5 text-amber-600" />,
        color: 'amber',
        tooltip: 'Packages that are no longer actively maintained',
        total: totalResultCounts,
      },
    ],
    [data, totalResultCounts]
  );

  const handleCardClick = (id: string) => {
    if (id === 'unlisted') {
      setActiveTab('unlisted');
      setActiveFilter(null);
    } else {
      setActiveTab('directory');
      setActiveFilter(activeFilter === id ? null : id);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between gap-2">
        <div>
          <HeadingWithInfo
            title="Overview"
            tooltip="Overview of React Native packages and their New Architecture support status"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Found {totalResultCounts} {totalResultCounts === 1 ? 'package' : 'packages'}
          </p>
        </div>
        <ExportButton data={fileExportData} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1250px]:grid-cols-5 gap-4 mt-6">
        {overviewCards.map(card => (
          <OverviewCard
            key={card.id}
            id={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            tooltip={card.tooltip}
            total={card.total}
            isActive={activeFilter === card.id}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
