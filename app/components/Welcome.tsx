import { Logo } from './Logo';
import { Button } from './ui/button';
import { useTranslation } from '~/hooks';
import logoUrl from '~/assets/logo.png';

export function Welcome() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-linear-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <Logo logoUrl={logoUrl} />

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {t.home.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="default" size="lg">
              {t.home.getStarted}
            </Button>
            <Button variant="outline" size="lg">
              {t.home.learnMore}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

