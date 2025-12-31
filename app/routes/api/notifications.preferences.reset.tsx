import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour réinitialiser les préférences de notifications via SSR
 * POST /api/notifications/preferences/reset
 */
export async function action({ request }: ActionFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.post("/notifications/preferences/reset");
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error resetting notification preferences:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la réinitialisation des préférences" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

