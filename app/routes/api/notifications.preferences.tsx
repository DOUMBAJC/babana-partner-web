import { data, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour gérer les préférences de notifications via SSR
 * GET /api/notifications/preferences - Récupérer les préférences
 * PUT /api/notifications/preferences - Mettre à jour les préférences
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/notifications/preferences");
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error fetching notification preferences:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors du chargement des préférences" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    
    const api = await createAuthenticatedApi(request);
    const response = await api.put("/notifications/preferences", body);
    
    return data({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Error updating notification preferences:", error);
    const status = error.response?.status || 500;
    const backendData = error.response?.data;
    return data(
      { 
        success: false, 
        // Keep both `message` + `error` for different error parsers in the client.
        message:
          backendData?.message || "Erreur lors de la mise à jour des préférences",
        error: {
          message:
            backendData?.message || "Erreur lors de la mise à jour des préférences",
          errors: backendData?.errors,
        },
        // `details` is used by our axios ApiError wrapper.
        details: backendData?.errors,
      },
      { status }
    );
  }
}

