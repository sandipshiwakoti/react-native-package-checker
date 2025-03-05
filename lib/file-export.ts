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

  doc.setFillColor(244, 244, 245);
  doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');

  doc.setFontSize(20);
  doc.setFont('', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text('React Native Package Checker Report', 14, 16);

  const summaryStartY = 35;
  const cardWidth = 45;
  const cardHeight = 25;
  const cardGap = 8;
  const startX = 14;

  const summaryCards = [
    { title: 'Total Packages', value: data.summary.total },
    { title: 'Supported', value: data.summary.supported },
    { title: 'Unsupported', value: data.summary.unsupported },
    { title: 'Untested', value: data.summary.untested },
    { title: 'Unlisted', value: data.summary.unlisted },
  ];

  doc.setFontSize(14);
  doc.setFont('', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text('Summary', startX, summaryStartY);

  summaryCards.forEach((card, index) => {
    const x = startX + (cardWidth + cardGap) * index;

    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, summaryStartY + 6, cardWidth, cardHeight, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setFont('', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text(card.title, x + 4, summaryStartY + 16);

    doc.setFontSize(16);
    doc.setFont('', 'bold');
    doc.setTextColor(24, 24, 27);
    doc.text(card.value.toString(), x + 5, summaryStartY + 28);
  });

  autoTable(doc, {
    startY: summaryStartY + cardHeight + 15,
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
      fillColor: [51, 65, 85],
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
