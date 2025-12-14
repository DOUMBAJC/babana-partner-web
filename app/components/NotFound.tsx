import { useNavigate } from 'react-router';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useState, useEffect } from 'react';
import { useTranslation } from '~/hooks';

/**
 * Page 404 - Page non trouvée
 * Design moderne avec animations, glassmorphism et support dark/light mode
 */
export function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/10 via-white to-babana-navy/5 dark:from-babana-navy dark:via-gray-900 dark:to-babana-cyan/10 transition-colors duration-500" />
      
      {/* Decorative Animated Blobs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-babana-navy/20 dark:bg-babana-navy/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-babana-blue/10 dark:bg-babana-blue/5 rounded-full blur-2xl animate-pulse" />

      <div className="container relative mx-auto px-4 py-20">
        <div className={`flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Large 404 Illustration with Glassmorphism */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-babana-cyan/30 dark:bg-babana-cyan/20 rounded-full blur-3xl group-hover:blur-[100px] transition-all duration-500 scale-150" />
            
            {/* 404 Number with Gradient and Animation */}
            <div className="relative">
              <h1 className="text-[12rem] md:text-[16rem] font-black leading-none">
                <span className="bg-linear-to-r from-babana-cyan via-babana-blue to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                  404
                </span>
              </h1>
              
              {/* Floating Icons */}
              <div className="absolute top-0 left-0 animate-bounce">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-babana-cyan opacity-50" />
              </div>
              <div className="absolute bottom-0 right-0 animate-bounce delay-500" style={{ animationDelay: '0.5s' }}>
                <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-babana-blue opacity-50" />
              </div>
            </div>
          </div>

          {/* Error Message Card with Glassmorphism */}
          <Card className="relative overflow-hidden border-2 border-babana-cyan/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl hover:shadow-babana-cyan/20 transition-all duration-300 max-w-2xl w-full">
            <CardContent className="p-8 md:p-12 space-y-6">
              {/* Error Code Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 border border-babana-cyan/30">
                <AlertCircle className="w-5 h-5 text-babana-cyan" />
                <span className="text-sm font-semibold text-babana-navy dark:text-babana-cyan">
                  {t.notFound.errorCode}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t.notFound.title}
              </h2>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t.notFound.description}
              </p>

              <p className="text-base text-muted-foreground">
                {t.notFound.message}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="group border-2 border-babana-cyan/50 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/10 hover:border-babana-cyan transition-all duration-300 px-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t.notFound.goBack}
                </Button>
                
                <Button 
                  onClick={handleGoHome}
                  size="lg"
                  className="group relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue hover:shadow-xl hover:shadow-babana-cyan/50 dark:hover:shadow-babana-cyan/30 transition-all duration-300 text-white px-6"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    {t.notFound.goHome}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>

              {/* Suggestions List */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  {t.notFound.suggestions.title}
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-babana-cyan mt-0.5">•</span>
                    <span>{t.notFound.suggestions.checkUrl}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-babana-cyan mt-0.5">•</span>
                    <span>{t.notFound.suggestions.useNavigation}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-babana-cyan mt-0.5">•</span>
                    <span>{t.notFound.suggestions.contact}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            
            {/* Bottom Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan" />
          </Card>

          {/* Additional Decorative Elements */}
          <div className="flex gap-4 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-babana-cyan animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
