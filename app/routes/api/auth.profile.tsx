import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route ressource pour mettre à jour le profil via SSR
 * PUT /api/auth/profile
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "PUT") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    const body = await request.json();
    
    const backendBody: any = {};
    
    // Ajouter personal_phone si présent
    if (body.personal_phone !== undefined && body.personal_phone !== null) {
      backendBody.personal_phone = body.personal_phone;
    }
    
    // Construire name au format "nom@prenom" (last_name@first_name)
    if (body.first_name !== undefined || body.last_name !== undefined) {
      const lastName = body.last_name || "";
      const firstName = body.first_name || "";
      backendBody.name = `${lastName}@${firstName}`;
    }
    
    const response = await api.put("/auth/profile", backendBody);
    
    // Le backend retourne généralement { success: true, data: { user } } ou directement { user }
    const responseData = response.data || response;
    return data({ 
      success: true, 
      data: responseData.data || { user: responseData.user || responseData },
      user: responseData.user || responseData.data?.user || responseData
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return data(
      { 
        success: false, 
        error: error.response?.data?.message || error.message || "Erreur lors de la mise à jour du profil" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

