import { json, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour marquer une notification comme lue via SSR
 * POST /api/notifications/:id/mark-as-read
 */
export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const { id } = params;
    
    if (!id) {
      return json(
        { success: false, error: "ID de notification manquant" },
        { status: 400 }
      );
    }
    
    const api = await createAuthenticatedApi(request);
    const response = await api.post(`/notifications/${id}/mark-as-read`);
    
    return json({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return json(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du marquage de la notification" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

