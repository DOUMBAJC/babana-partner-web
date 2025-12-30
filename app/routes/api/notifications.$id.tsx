import { json, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour supprimer une notification via SSR
 * DELETE /api/notifications/:id
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
    const response = await api.delete(`/notifications/${id}`);
    
    return json({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return json(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la suppression" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

