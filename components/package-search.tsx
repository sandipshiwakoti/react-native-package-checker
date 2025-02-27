'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileJson } from 'lucide-react';
import { Input } from './ui/input';
import { useDropzone } from 'react-dropzone';

export function PackageSearch() {
  const router = useRouter();

  const goToCheckPage = (packageNames: string[]) => {
    router.push(`/check?packages=${packageNames.join(',')}`);
  };

  const handleSearch = (value: string) => {
    const packageNames = value
      .split(',')
      .map(name => name.trim())
      .filter(Boolean);
    if (packageNames.length > 0) {
      goToCheckPage(packageNames);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    onDrop: async files => {
      try {
        const content = await files[0].text();
        const json = JSON.parse(content);
        const deps = Object.keys(json.dependencies || {});
        if (deps.length > 0) {
          goToCheckPage(deps);
        }
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search packages (e.g. react-native-reanimated)"
              className="h-14 text-lg pl-12"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

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
      </div>
    </>
  );
}
