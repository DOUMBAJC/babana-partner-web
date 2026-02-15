import { useNavigate } from 'react-router';
import { Home, RefreshCcw, AlertTriangle, Bug, Activity } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useState, useEffect } from 'react';
import { useTranslation } from '~/hooks';

interface ServerErrorProps {
  error: unknown;
  isDev?: boolean;
}

/**
 * Server Error Component (500)
 * Modern design with animations, glassmorphism and dark/light mode support
 * Aligned with Babana Platform Theme (Navy/Cyan/Blue)
 */
export function ServerError({ error, isDev = false }: ServerErrorProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showStack, setShowStack] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  let errorMessage = "An unexpected error occurred.";
  let errorStack: string | undefined;

  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error);
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-background font-sans">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-babana-navy/10 via-background to-babana-cyan/5 dark:from-babana-navy dark:via-background dark:to-babana-cyan/10 transition-colors duration-500" />
      
      {/* Decorative Animated Blobs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-babana-blue/20 dark:bg-babana-blue/10 rounded-full blur-3xl animate-pulse delay-1000" style={{ animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-babana-navy/5 dark:bg-babana-navy/20 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="container relative mx-auto px-4 py-10 md:py-20">
        <div className={`flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Main Error Illustration */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-babana-cyan/30 rounded-full blur-3xl group-hover:blur-[80px] transition-all duration-500 scale-150" />
            
            {/* Icon Circle */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto bg-linear-to-br from-babana-cyan/20 to-babana-blue/20 dark:from-babana-navy dark:to-babana-blue/30 rounded-full flex items-center justify-center shadow-lg border border-babana-cyan/30 dark:border-babana-cyan/20 animate-float backdrop-blur-sm">
               <Activity className="w-16 h-16 md:w-20 md:h-20 text-babana-blue dark:text-babana-cyan" />
               
               {/* Floating Warning Icon */}
               <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDuration: '2s' }}>
                 <div className="bg-white dark:bg-babana-navy rounded-full p-2 shadow-md border border-red-100 dark:border-red-900/30">
                   <Bug className="w-8 h-8 text-red-500" />
                 </div>
               </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 max-w-2xl px-4">
             <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-babana-navy via-babana-blue to-babana-cyan dark:from-white dark:via-babana-cyan dark:to-babana-blue">
               {t.serverError.title}
             </h1>
             <p className="text-lg md:text-xl text-muted-foreground">
               {t.serverError.description}
             </p>
          </div>

          {/* Error Card */}
          <Card className="w-full max-w-2xl relative overflow-hidden border border-babana-cyan/20 dark:border-babana-cyan/10 bg-white/80 dark:bg-card/80 backdrop-blur-lg shadow-2xl hover:shadow-babana-cyan/10 transition-all duration-300">
             <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-babana-cyan to-babana-blue" />
             
             <CardContent className="p-6 md:p-8 space-y-6 text-left">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-lg shrink-0 border border-red-100 dark:border-red-900/20">
                   <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                 </div>
                 <div className="flex-1 space-y-2">
                   <h3 className="font-semibold text-foreground">{t.serverError.details}</h3>
                   <p className="text-sm font-mono p-4 rounded-lg break-all border border-babana-cyan/20 bg-babana-cyan/5 text-babana-navy dark:text-babana-cyan-light dark:bg-babana-navy/50">
                     {errorMessage}
                   </p>
                 </div>
               </div>

               {isDev && errorStack && (
                 <div className="border-t border-border pt-4">
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setShowStack(!showStack)}
                     className="text-xs text-muted-foreground hover:text-foreground mb-2"
                   >
                     {showStack ? t.serverError.dev.hideStack : t.serverError.dev.showStack}
                   </Button>
                   
                   {showStack && (
                     <div className="bg-babana-navy text-cyan-50 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64 shadow-inner border border-babana-blue/20">
                       <pre>{errorStack}</pre>
                     </div>
                   )}
                 </div>
               )}
             </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Button 
              onClick={handleReload}
              size="lg"
              variant="outline"
              className="gap-2 border-babana-cyan/30 hover:bg-babana-cyan/5 hover:text-babana-blue dark:border-babana-cyan/20 dark:hover:bg-babana-cyan/10 dark:hover:text-babana-cyan transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              {t.serverError.buttons.reload}
            </Button>
            
            <Button 
              onClick={handleGoHome}
              size="lg" 
              className="gap-2 bg-linear-to-r from-babana-blue to-babana-cyan hover:from-babana-blue/90 hover:to-babana-cyan/90 text-white shadow-lg hover:shadow-babana-cyan/25 transition-all"
            >
               <Home className="w-4 h-4" />
               {t.serverError.buttons.home}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
