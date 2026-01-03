import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour mettre à jour l'activité de session via SSR
 * POST /api/sessions/activity
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    await api.post("/auth/sessions/activity");
    
    return data({ success: true });
  } catch (error: any) {
    console.error("Error updating session activity:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la mise à jour de l'activité" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

