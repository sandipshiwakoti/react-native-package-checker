import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { AlertCircle, FileJson, Package2, UploadIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface PackageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPackages: string[];
  onAnalyze: (packages: string[]) => void;
}

export function PackageUploadModal({
  open,
  onOpenChange,
  defaultPackages,
  onAnalyze,
}: PackageUploadModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultPackages));
  const [packages, setPackages] = useState<string[]>(defaultPackages);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    onDrop: async files => {
      try {
        const content = await files[0].text();
        const json = JSON.parse(content);
        const deps = Object.keys(json.dependencies || {});
        if (deps.length > 0) {
          setSelected(new Set(deps));
          setPackages(deps);
        }
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
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
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
          >
            <input {...getInputProps()} />
            <FileJson className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload package.json</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop your package.json here, or click to select
            </p>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">
              {Array.from(selected).length} of {packages.length} packages selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(new Set(packages))}
              className="text-sm"
            >
              Select All
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {packages.map(pkg => (
                <div
                  key={pkg}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/70 bg-muted/50"
                >
                  <Checkbox
                    checked={selected.has(pkg)}
                    onCheckedChange={checked => {
                      const newSelected = new Set(selected);
                      if (checked) {
                        newSelected.add(pkg);
                      } else {
                        newSelected.delete(pkg);
                      }
                      setSelected(newSelected);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pkg}</span>
                    <a
                      href={`https://www.npmjs.com/package/${pkg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Package2 className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => onAnalyze(Array.from(selected))}
              disabled={selected.size === 0}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Analyze {selected.size} Package{selected.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
