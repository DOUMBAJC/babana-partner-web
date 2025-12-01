import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour détecter si l'utilisateur a scrollé
 * @param threshold - Distance de scroll en pixels avant de déclencher l'état
 * @returns boolean - true si scrollé au-delà du threshold
 */
export function useScrolled(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Vérifier l'état initial
    handleScroll();

    // Ajouter l'écouteur d'événement
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Nettoyer
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, threshold]);

  return scrolled;
}

