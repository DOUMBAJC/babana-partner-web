import { json, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour charger les notifications via SSR
 * GET /api/notifications?per_page=10&unread_only=false
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/notifications", { params });
    
    return json({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return json(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du chargement des notifications" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

