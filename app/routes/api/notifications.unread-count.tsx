import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour charger le nombre de notifications non lues via SSR
 * GET /api/notifications/unread-count
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/notifications/unread-count");
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error fetching unread count:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du chargement du compteur" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

