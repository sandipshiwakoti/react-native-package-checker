import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface PackageUploaderProps {
  onPackagesFound: (_packages: string[], _rnVersion: string) => void;
  children?: React.ReactNode;
  isDragActive?: boolean;
}

export function PackageUploader({
  onPackagesFound,
  children,
  isDragActive: externalDragActive,
}: PackageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive: internalDragActive,
  } = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    onDrop: async files => {
      try {
        setIsDragging(false);
        const file = files[0];
        if (file.name !== 'package.json') {
          toast.error('Please upload a valid package.json file');
          return;
        }

        const content = await file.text();
        const json = JSON.parse(content);

        if (!json.dependencies) {
          toast.error('No dependencies found in package.json');
          return;
        }
        const rnVersion = json.dependencies['react-native'];
        const deps = Object.keys(json.dependencies);
        if (deps.length === 0) {
          toast.error('No dependencies found in package.json');
          return;
        }
        onPackagesFound(deps, rnVersion);
      } catch (e) {
        console.error('File upload error:', e);
        if (e instanceof SyntaxError) {
          toast.error('Invalid package.json file. Please check the file format.');
        } else {
          toast.error('Failed to process package.json file.');
        }
      }
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const isDragActiveState = externalDragActive ?? internalDragActive;

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        transition-all duration-200 ease-in-out
        ${
          isDragActiveState
            ? 'border-primary/70 bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
            : 'border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/50'
        }
        ${isDragging ? 'border-primary shadow-xl shadow-primary/30 bg-primary/5 scale-[1.03]' : ''}
      `}
    >
      <input {...getInputProps()} />
      {children || (
        <div>
          <FileJson className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="sm:text-lg font-medium mb-2">
            {isDragActiveState ? 'Drop package.json here' : 'Upload package.json'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isDragActiveState
              ? 'Release to analyze dependencies'
              : 'Drag & drop your package.json here, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
}
