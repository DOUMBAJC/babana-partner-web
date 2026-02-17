import { data, type LoaderFunctionArgs } from "react-router";
import { createApiFromRequest } from "~/services/api.server";

/**
 * Route API pour récupérer les liens des vidéos des tutoriels
 * GET /api/tutorials/videos
 * GET /api/tutorials/videos?tutorialId=xxx
 * 
 * Retourne un objet avec les liens des vidéos indexés par identifiant de tutoriel/étape
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createApiFromRequest(request);
    const url = new URL(request.url);
    const tutorialId = url.searchParams.get("tutorialId");
    const endpoint = tutorialId 
      ? `/tutorials/${tutorialId}/videos`
      : `/tutorials/videos`;

    try {
      const response = await api.get(endpoint);
      return data({
        success: true,
        videos: response.data,
      });
    } catch (apiError: any) {
      // Si l'endpoint n'existe pas encore côté backend, retourner un fallback
      // avec les vidéos locales pour le développement
      if (apiError.response?.status === 404) {
        console.warn("[Tutorials Videos API] Endpoint not found, using fallback");
        return data({
          success: true,
          videos: getFallbackVideos(tutorialId),
        });
      }
      throw apiError;
    }
  } catch (error: any) {
    console.error("[Tutorials Videos API] Error fetching videos:", error);
    
    // En cas d'erreur, retourner les vidéos de fallback
    const url = new URL(request.url);
    const tutorialId = url.searchParams.get("tutorialId");
    
    return data({
      success: true,
      videos: getFallbackVideos(tutorialId),
    });
  }
}

/**
 * Fonction de fallback qui retourne les vidéos locales
 * À remplacer par les vraies URLs une fois l'API backend configurée
 * 
 * Cette fonction mappe les videoId aux URLs réelles.
 * Le backend devrait retourner un format similaire avec les URLs complètes.
 */
function getFallbackVideos(tutorialId: string | null): Record<string, any> {
  const fallbackVideos: Record<string, any> = {
    "getting-started": {
      main: null,
      steps: {
        "1": "/videos/signup.mp4", // videoId: 'signup'
      },
    },
    "sim-activation": {
      main: "/videos/vente-sim.mp4", // videoId: 'vente-sim'
      steps: {},
    },
    "manage-account": {
      main: null,
      steps: {
        "3": "/videos/reset-password.mp4", // videoId: 'reset-password'
      },
    },
  };

  if (tutorialId) {
    return {
      [tutorialId]: fallbackVideos[tutorialId] || { main: null, steps: {} },
    };
  }

  return fallbackVideos;
}

