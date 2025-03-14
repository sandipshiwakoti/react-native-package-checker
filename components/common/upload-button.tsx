import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadIcon } from 'lucide-react';

import { PackageUploader } from '@/components/common/package-uploader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const goToCheckPage = (packageNames: string[], rnVersion?: string) => {
    const versionParam = rnVersion ? `&version=${rnVersion}` : '';
    router.push(`/check?packages=${packageNames.join(',')}${versionParam}`);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="font-normal">
        <div className="flex flex-row gap-2 items-center">
          <UploadIcon className="h-4 w-4 opacity-50" />
          Upload
        </div>
      </Button>
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
