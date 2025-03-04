import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EXPORTED_FILE_NAME_PREFIX } from '@/constants';
import { FileExportData, PackageInfo, PDFExportOptions } from '@/types';

const generateTimestampedFileName = (prefix: string, extension: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}${extension}`;
};

export const prepareFileExportData = (packages: Record<string, PackageInfo>): FileExportData => {
  const summary = {
    total: Object.keys(packages).length,
    supported: 0,
    unsupported: 0,
    untested: 0,
    unlisted: 0,
    unmaintained: 0,
  };

  const packageData = Object.entries(packages).map(([name, info]) => {
    if (info.notInDirectory) {
      summary.unlisted++;
    } else if (info.newArchitecture === 'supported') {
      summary.supported++;
    } else if (info.newArchitecture === 'unsupported') {
      summary.unsupported++;
    } else {
      summary.untested++;
    }
    if (info.unmaintained) summary.unmaintained++;

    return {
      name,
      notInDirectory: info.notInDirectory,
      status: {
        newArchitecture: info.newArchitecture || 'untested',
        maintenance: info.notInDirectory
          ? 'N/A'
          : info.unmaintained
            ? 'Unmaintained'
            : 'Maintained',
      },
      links: {
        github: info.githubUrl,
        npm: info.npmUrl,
      },
      metrics: {
        score: info.score,
        stars: info.github?.stargazers_count,
        forks: info.github?.forks_count,
        issues: info.github?.open_issues_count,
        lastUpdated: info.github?.updated_at,
      },
      support: {
        platforms: [
          ...(info.platforms?.ios ? ['iOS'] : []),
          ...(info.platforms?.android ? ['Android'] : []),
          ...(info.platforms?.web ? ['Web'] : []),
        ],
        typescript: info.support?.hasTypes || false,
        license: info.support?.license || undefined,
      },
      description: info.github?.description,
      alternatives: info.alternatives,
    };
  });

  return {
    summary,
    packages: packageData,
    generatedAt: new Date().toLocaleString(),
  };
};

export const generatePDF = (data: FileExportData, options: PDFExportOptions = {}) => {
  const {
    fileName = generateTimestampedFileName(EXPORTED_FILE_NAME_PREFIX, '.pdf'),
    orientation = 'landscape',
    pageSize = 'A4',
    includeFooter = true,
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  doc.setFontSize(16);
  doc.setFont('', 'bold');
  doc.text('React Native Package Analysis Report', 14, 15);
  doc.setFontSize(11);
  doc.setFont('', 'semibold');
  doc.text('Summary:', 14, 25);

  const summaryData = [
    [
      { content: 'Total Packages', styles: { fontStyle: 'bold' } },
      { content: 'New Architecture', styles: { fontStyle: 'bold' } },
      { content: 'Status', styles: { fontStyle: 'bold' } },
    ],
    [
      { content: data.summary.total.toString() },
      { content: `Supported: ${data.summary.supported}` },
      { content: `Unlisted: ${data.summary.unlisted}` },
    ],
    [
      { content: '' },
      { content: `Unsupported: ${data.summary.unsupported}` },
      { content: `Unmaintained: ${data.summary.unmaintained}` },
    ],
    [{ content: '' }, { content: `Untested: ${data.summary.untested}` }, { content: '' }],
  ];

  autoTable(doc, {
    startY: 30,
    body: summaryData as any,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
    },
  });

  autoTable(doc, {
    head: [
      [
        '#',
        'Package',
        'New Architecture',
        'Maintenance',
        'Score',
        'Stars',
        'Last Updated',
        'Platforms',
        'Links',
        'Alternatives',
      ],
    ],
    body: data.packages
      .sort((a, b) => {
        // Handle unlisted packages to be at the end
        if (a.notInDirectory !== b.notInDirectory) {
          return a.notInDirectory ? 1 : -1;
        }

        const order = {
          Supported: 1,
          Unsupported: 2,
          Untested: 3,
          'N/A': 4,
        };

        const aStatus = a.notInDirectory
          ? 'N/A'
          : a.status.newArchitecture.charAt(0).toUpperCase() +
            a.status.newArchitecture.slice(1).toLowerCase();
        const bStatus = b.notInDirectory
          ? 'N/A'
          : b.status.newArchitecture.charAt(0).toUpperCase() +
            b.status.newArchitecture.slice(1).toLowerCase();

        const aOrder = order[aStatus as keyof typeof order];
        const bOrder = order[bStatus as keyof typeof order];

        if (aOrder === bOrder && aOrder === 1) {
          return a.status.maintenance === 'Unmaintained' ? 1 : -1;
        }
        return aOrder - bOrder;
      })
      .map((pkg, index) => [
        (index + 1).toString(),
        pkg.name,
        pkg.notInDirectory
          ? 'N/A'
          : pkg.status.newArchitecture.charAt(0).toUpperCase() +
            pkg.status.newArchitecture.slice(1).toLowerCase(),
        pkg.status.maintenance,
        pkg.metrics?.score?.toString() || 'N/A',
        pkg.metrics?.stars?.toLocaleString() || 'N/A',
        pkg.metrics?.lastUpdated ? new Date(pkg.metrics.lastUpdated).toLocaleDateString() : 'N/A',
        pkg.support?.platforms.join(', ') || 'N/A',
        {
          content:
            pkg.links.github && pkg.links.npm
              ? `GitHub: ${pkg.links.github.replace(/(?:https?:\/\/)?(?:www\.)?/i, '')}\nNPM: ${pkg.links.npm.replace(/(?:https?:\/\/)?(?:www\.)?/i, '')}`
              : pkg.links.github
                ? `GitHub: ${pkg.links.github.replace(/(?:https?:\/\/)?(?:www\.)?/i, '')}`
                : pkg.links.npm
                  ? `NPM: ${pkg.links.npm.replace(/(?:https?:\/\/)?(?:www\.)?/i, '')}`
                  : 'N/A',
          styles: {
            cellWidth: 45,
            overflow: 'linebreak',
            fontStyle: 'normal',
          },
        },
        pkg.alternatives?.join(', ') || 'N/A',
      ]),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 8 }, // #
      1: { cellWidth: 35 }, // Package
      2: { cellWidth: 25 }, // New Architecture
      3: { cellWidth: 20 }, // Maintenance
      4: { cellWidth: 15 }, // Score
      5: { cellWidth: 15 }, // Stars
      6: { cellWidth: 25 }, // Last Updated
      7: { cellWidth: 25 }, // Platforms
      8: { cellWidth: 45 }, // Links
      9: { cellWidth: 35 }, // Alternatives
    },
  });

  if (includeFooter) {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Generated on ${data.generatedAt} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
  }

  // Save the PDF
  doc.save(fileName);
};

export const generateCSV = (data: FileExportData) => {
  const fileName = generateTimestampedFileName(EXPORTED_FILE_NAME_PREFIX, '.csv');
  const headers = [
    '#',
    'Package',
    'New Architecture',
    'Maintenance',
    'Score',
    'Stars',
    'Last Updated',
    'Platforms',
    'Links',
    'Alternatives',
  ];

  const rows = data.packages
    .sort((a, b) => {
      // Handle unlisted packages to be at the end
      if (a.notInDirectory !== b.notInDirectory) {
        return a.notInDirectory ? 1 : -1;
      }

      const order = {
        SUPPORTED: 1,
        UNSUPPORTED: 2,
        UNTESTED: 3,
        'N/A': 4,
      };

      const aStatus = a.notInDirectory ? 'N/A' : a.status.newArchitecture.toUpperCase();
      const bStatus = b.notInDirectory ? 'N/A' : b.status.newArchitecture.toUpperCase();

      const aOrder = order[aStatus as keyof typeof order];
      const bOrder = order[bStatus as keyof typeof order];

      if (aOrder === bOrder && aOrder === 1) {
        return a.status.maintenance === 'Unmaintained' ? 1 : -1;
      }
      return aOrder - bOrder;
    })
    .map((pkg, index) => [
      (index + 1).toString(),
      pkg.name,
      pkg.notInDirectory
        ? 'N/A'
        : pkg.status.newArchitecture.charAt(0).toUpperCase() +
          pkg.status.newArchitecture.slice(1).toLowerCase(),
      pkg.status.maintenance,
      pkg.metrics?.score?.toString() || 'N/A',
      pkg.metrics?.stars?.toLocaleString() || 'N/A',
      pkg.metrics?.lastUpdated ? new Date(pkg.metrics.lastUpdated).toLocaleDateString() : 'N/A',
      pkg.support?.platforms.join(', ') || 'N/A',
      [
        pkg.links.github ? `GitHub: ${pkg.links.github}` : '',
        pkg.links.npm ? `NPM: ${pkg.links.npm}` : '',
      ]
        .filter(Boolean)
        .join(' | '),
      pkg.alternatives?.join(', ') || 'N/A',
    ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
