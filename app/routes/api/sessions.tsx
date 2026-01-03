import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour charger les sessions via SSR
 * GET /api/sessions
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/auth/sessions");
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du chargement des sessions" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

