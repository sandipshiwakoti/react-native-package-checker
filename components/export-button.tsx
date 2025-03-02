import React from 'react';
import { generatePDF, generateCSV } from '../lib/file-export';
import { FileExportData } from '../types';
import { ChevronDown, FileUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

interface ExportButtonProps {
  data: FileExportData;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="min-w-[160px] flex flex-row justify-between">
        <Button variant="outline" className="font-normal">
          <div className="flex flex-row gap-2 items-center">
            <FileUp className="h-4 w-4 opacity-50" />
            Export
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent className="min-w-[160px] bg-white rounded-md p-1 shadow-lg">
          <DropdownMenuItem
            className="flex items-center px-2 py-2 text-sm outline-none cursor-default hover:bg-gray-100 rounded-sm"
            onClick={() => generatePDF(data)}
          >
            Export all as PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center px-2 py-2 text-sm outline-none cursor-default hover:bg-gray-100 rounded-sm"
            onClick={() => generateCSV(data)}
          >
            Export all as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
