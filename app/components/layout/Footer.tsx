import { ConsentSettings } from '~/components/ConsentSettings';
import { useLanguage } from '~/hooks';

/**
 * Exemple de Footer avec lien vers les paramètres de consentement
 * À intégrer dans votre layout principal
 */
export function Footer() {
  const { language } = useLanguage();
  const fullYear = new Date().getFullYear();

  const t = {
    fr: {
      rights: `© 2025 - ${fullYear} BABANA. Tous droits réservés.`,
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
    },
    en: {
      rights: `© 2025 - ${fullYear} BABANA. All rights reserved.`,
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  };

  const content = language === 'fr' ? t.fr : t.en;

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm pb-24 md:pb-6">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {/* Copyright */}
          <div className="order-3 md:order-1 text-xs text-muted-foreground opacity-60">
            {content.rights}
          </div>

          {/* Liens - Style rafraîchi */}
          <div className="order-2 flex flex-col sm:flex-row items-center gap-3 md:gap-6 text-sm w-full md:w-auto">
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors px-2 py-1">
                {content.privacy}
              </button>
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <button className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors px-2 py-1">
                {content.terms}
              </button>
            </div>
            
            <div className="w-full h-px bg-border/50 sm:hidden" />
            
            <ConsentSettings 
              variant="link" 
              className="bg-muted/30 hover:bg-muted border border-border/50 hover:border-border text-xs font-medium w-full sm:w-auto justify-center" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

