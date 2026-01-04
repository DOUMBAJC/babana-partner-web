import { ConsentSettings } from '~/components/ConsentSettings';
import { useLanguage } from '~/hooks';

/**
 * Exemple de Footer avec lien vers les paramètres de consentement
 * À intégrer dans votre layout principal
 */
export function Footer() {
  const { language } = useLanguage();

  const t = {
    fr: {
      rights: `© 2025 - ${new Date().getFullYear()} BABANA. Tous droits réservés.`,
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
    },
    en: {
      rights: `© 2025 - ${new Date().getFullYear()} BABANA. All rights reserved.`,
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  };

  const content = language === 'fr' ? t.fr : t.en;

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {content.rights}
          </p>

          {/* Liens */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              {content.privacy}
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              {content.terms}
            </button>
            <span className="text-muted-foreground">•</span>
            <ConsentSettings variant="link" />
          </div>
        </div>
      </div>
    </footer>
  );
}

