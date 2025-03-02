import Image from 'next/image';
import { PackageSearch } from '../components/package-search';

export default function HomePage() {
  return (
    <div className="min-h-screen py-24 bg-dot-pattern">
      <div className="max-w-[800px] mx-auto px-4 space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center mb-2">
            <Image
              src="/assets/images/logo.png"
              alt="React Native Directory Logo"
              width={150}
              height={150}
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              React Native Package Checker
            </h1>
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">
                Check React Native packages for New Architecture compatibility
              </p>
            </div>
          </div>
        </div>
        <PackageSearch />
      </div>
    </div>
  );
}
