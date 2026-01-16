import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour changer le mot de passe via SSR
 * POST /api/auth/change-password
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    const body = await request.json();
    
    // Le serveur attend current_password, new_password et password_confirmation
    const backendBody = {
      current_password: body.current_password,
      new_password: body.new_password,
      password_confirmation: body.password_confirmation,
    };
    
    await api.post("/auth/change-password", backendBody);
    
    return data({ success: true, message: "Mot de passe modifié avec succès" });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || error.message || "Erreur lors du changement de mot de passe" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

