import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour révoquer toutes les autres sessions via SSR
 * DELETE /api/sessions/other/revoke
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    await api.delete("/auth/sessions/other/revoke");
    
    return data({ success: true });
  } catch (error: any) {
    console.error("Error revoking other sessions:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || "Erreur lors de la révocation des autres sessions" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

