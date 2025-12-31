import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "~/hooks";

/**
 * Toaster global (Sonner)
 * Utilisé pour afficher des retours modernes (succès/erreur) sur les actions (accept/reject, etc.).
 */
export function Toaster() {
  const { actualTheme } = useTheme();

  return (
    <SonnerToaster
      theme={actualTheme}
      position="top-right"
      closeButton
      richColors
      duration={4500}
      expand
    />
  );
}


