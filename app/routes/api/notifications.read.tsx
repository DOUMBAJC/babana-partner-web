import { json, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour supprimer toutes les notifications lues via SSR
 * DELETE /api/notifications/read
 */
export async function action({ request }: ActionFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.delete("/notifications/read");
    
    return json({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error deleting read notifications:", error);
    return json(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la suppression des notifications lues" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

