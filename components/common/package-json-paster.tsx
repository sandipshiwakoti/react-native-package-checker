import { useState } from 'react';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDependency } from '@/lib/helpers';

interface PackageJsonPasterProps {
  onPackagesFound: (packages: string[]) => void;
}

export function PackageJsonPaster({ onPackagesFound }: PackageJsonPasterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);

  const handleClose = () => {
    setJsonContent('');
    setIsValidJson(true);
  };

  const validateAndSetJson = (content: string) => {
    setJsonContent(content);
    try {
      if (content.trim()) {
        JSON.parse(content);
        setIsValidJson(true);
      }
    } catch {
      setIsValidJson(false);
    }
  };

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
      setIsValidJson(true);
    } catch {
      toast.error('Invalid JSON content');
    }
  };

  const handlePasteJson = async () => {
    try {
      if (!jsonContent.trim()) {
        toast.error('Please paste package.json content');
        return;
      }

      const json = JSON.parse(jsonContent);

      if (!json.dependencies) {
        toast.error('No dependencies found in package.json');
        return;
      }

      const deps = Object.entries(json.dependencies).map(([name, version]) =>
        formatDependency(name, version as string)
      );
      if (deps.length === 0) {
        toast.error('No dependencies found in package.json');
        return;
      }
      onPackagesFound(deps);
    } catch (error) {
      toast.error('Invalid package.json content');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl border bg-background hover:bg-accent transition-colors">
          <Clipboard className="h-5 w-5" />
          <span className="font-medium">Paste package.json</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Clipboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Paste package.json</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Paste your complete package.json file or just the dependencies section
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrettify}
            disabled={!jsonContent.trim()}
            className="justify-end text-xs bg-background/80 backdrop-blur-sm"
          >
            Prettify JSON
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <textarea
            placeholder='{"dependencies": {"react-native": "0.72.0", ...}}'
            value={jsonContent}
            onChange={e => validateAndSetJson(e.target.value)}
            className={`min-h-[400px] w-full font-mono text-sm p-4 rounded-lg border ${
              !isValidJson && jsonContent.trim() ? 'border-red-500' : ''
            } bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20`}
          />

          {!isValidJson && jsonContent.trim() && (
            <p className="text-xs text-red-500">Invalid JSON format</p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePasteJson}
              disabled={!isValidJson}
              className="bg-primary hover:bg-primary/90"
            >
              Check Compatibility
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
