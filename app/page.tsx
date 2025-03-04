import { PackageSearch } from '../components/package-search';
import { Logo } from '../components/logo';

export default function HomePage() {
  return (
    <div className="min-h-screen py-10 bg-dot-pattern max-w-[800px] flex flex-col justify-center items-center mx-auto px-4 space-y-5 ">
      <div className="">
        <div className="text-center space-y-6">
          <Logo variant="vertical" size="large" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Is your React Native app ready for the New Architecture? Check all your packages at
            once.
          </p>
        </div>
        <PackageSearch />
      </div>
    </div>
  );
}
