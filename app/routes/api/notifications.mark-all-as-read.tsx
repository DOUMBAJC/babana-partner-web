import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour marquer toutes les notifications comme lues via SSR
 * POST /api/notifications/mark-all-as-read
 */
export async function action({ request }: ActionFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.post("/notifications/mark-all-as-read");
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du marquage des notifications" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

