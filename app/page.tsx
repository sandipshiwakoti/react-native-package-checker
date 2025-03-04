import { PackageSearch } from '../components/package-search';
import { Logo } from '../components/logo';
import { Footer } from '../components/footer';

export default function HomePage() {
  return (
    <div className="max-w-[800px] mx-auto min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full px-4 py-10">
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
      <Footer />
    </div>
  );
}
