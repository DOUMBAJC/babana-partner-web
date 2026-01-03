import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour révoquer une session via SSR
 * DELETE /api/sessions/:id
 */
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { id } = params;
    if (!id) {
      return data({ success: false, error: "Session ID is required" }, { status: 400 });
    }

    const api = await createAuthenticatedApi(request);
    await api.delete(`/auth/sessions/${id}`);
    
    return data({ success: true });
  } catch (error: any) {
    console.error("Error revoking session:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la révocation de la session" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

