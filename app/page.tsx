import { PackageSearch } from '../components/package-search';
import { Logo } from '../components/logo';

export default function HomePage() {
  return (
    <div className="min-h-screen py-24 bg-dot-pattern">
      <div className="max-w-[800px] mx-auto px-4 space-y-5">
        <div className="text-center space-y-6">
          <Logo variant="vertical" size="large" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Is your React Native app ready for the New Architecture? Check all your packages at
            once.
          </p>
        </div>
        <PackageSearch />
      </div>
    </div>
  );
}
