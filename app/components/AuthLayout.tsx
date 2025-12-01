import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Logo } from '~/components';
import { Shield, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '~/hooks';
import gsap from 'gsap';
import logoUrl from '~/assets/logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showLogo?: boolean;
}

/**
 * Layout réutilisable pour les pages d'authentification (connexion, inscription)
 * avec design split-screen moderne
 */
export function AuthLayout({ children, title, description, showLogo = true }: AuthLayoutProps) {
  const { language } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Animations GSAP au chargement
  useEffect(() => {
    // S'assurer que GSAP est disponible et qu'on est côté client
    if (typeof window === 'undefined' || !gsap) return;

    // Petit délai pour s'assurer que le DOM est complètement rendu
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animation du panneau de branding
        if (brandingRef.current) {
          gsap.fromTo(
            brandingRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        }

        // Animation du conteneur de formulaire
        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );

          // Animation des éléments du formulaire (SAUF les boutons)
          const formElements = formRef.current.querySelectorAll('.form-element:not(button):not(.form-button)');
          if (formElements.length > 0) {
            gsap.fromTo(
              formElements,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.3,
              }
            );
          }

          // Animation séparée pour les boutons (seulement translation, pas d'opacité)
          const buttons = formRef.current.querySelectorAll('button[type="submit"], .form-button');
          if (buttons.length > 0) {
            gsap.fromTo(
              buttons,
              { y: 20, opacity: 1 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out',
                delay: 0.5,
              }
            );
          }
        }
      });

      return () => {
        ctx.revert();
        clearTimeout(timer);
      };
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Panneau de branding - Côté gauche */}
      <div 
        ref={brandingRef}
        className="relative hidden lg:flex lg:w-1/2 bg-linear-to-br from-babana-navy via-[#1a2970] to-babana-cyan overflow-hidden"
      >
        {/* Effets de fond animés */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="mb-12">
            <Logo logoUrl={logoUrl} size="xl" className="mb-6" />
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-white to-babana-cyan bg-clip-text text-transparent">
              {t('Bienvenue sur', 'Welcome to')}<br />BABANA Partner
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {t('Votre plateforme de gestion professionnelle', 'Your professional management platform')}
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4 group">
              <div className="mt-1 rounded-lg bg-white/10 backdrop-blur-sm p-3 group-hover:bg-babana-cyan/30 transition-colors duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {t('Sécurisé & Fiable', 'Secure & Reliable')}
                </h3>
                <p className="text-white/70">
                  {t('Protection de vos données avec authentification avancée', 'Advanced authentication protects your data')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="mt-1 rounded-lg bg-white/10 backdrop-blur-sm p-3 group-hover:bg-babana-cyan/30 transition-colors duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {t('Performant & Rapide', 'Fast & Efficient')}
                </h3>
                <p className="text-white/70">
                  {t('Interface moderne et réactive pour une productivité maximale', 'Modern, responsive interface for maximum productivity')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="mt-1 rounded-lg bg-white/10 backdrop-blur-sm p-3 group-hover:bg-babana-cyan/30 transition-colors duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {t('Intuitive & Élégante', 'Intuitive & Elegant')}
                </h3>
                <p className="text-white/70">
                  {t('Design pensé pour simplifier votre quotidien', 'Design crafted to simplify your daily workflow')}
                </p>
              </div>
            </div>
          </div>

          {/* Décoration */}
          <div className="mt-auto pt-12">
            <div className="flex items-center space-x-2 text-white/60">
              <div className="h-px bg-white/30 flex-1" />
              <span className="text-sm">{t('Propulsé par BABANA', 'Powered by BABANA')}</span>
              <div className="h-px bg-white/30 flex-1" />
            </div>
          </div>
        </div>

        {/* Cercles décoratifs animés */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Formulaire - Côté droit */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div ref={formRef} className="w-full max-w-md">
          {/* Logo mobile */}
          {showLogo && (
            <div className="lg:hidden flex justify-center mb-8 form-element">
              <Logo logoUrl={logoUrl} size="lg" />
            </div>
          )}

          {/* En-tête */}
          <div className="text-center mb-8 form-element">
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Contenu du formulaire */}
          {children}
        </div>
      </div>
    </div>
  );
}

