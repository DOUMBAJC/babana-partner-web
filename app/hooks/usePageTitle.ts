import { useEffect } from "react";
import { useTranslation } from "./useTranslation";

/**
 * Hook pour gérer le titre de la page dynamiquement.
 * Met à jour le document.title en fonction du titre fourni ou de la clé de traduction.
 *
 * @param title Le titre à afficher (déjà traduit)
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
