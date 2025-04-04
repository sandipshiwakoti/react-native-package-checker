import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadIcon } from 'lucide-react';

import { PackageUploader } from '@/components/common/package-uploader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const goToCheckPage = (packageNames: string[]) => {
    router.push(`/check?packages=${packageNames.join(',')}`);
    setIsOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)} className="font-normal">
              <div className="flex flex-row gap-2 items-center">
                <UploadIcon className="h-4 w-4" />
                Upload
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload package.json</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <UploadIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Upload Packages</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload package.json to analyze for New Architecture compatibility
                </p>
              </div>
            </div>
          </DialogHeader>
          <PackageUploader onPackagesFound={goToCheckPage} />
        </DialogContent>
      </Dialog>
    </>
  );
};
