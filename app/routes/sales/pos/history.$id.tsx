import { data } from "react-router";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import type { Route } from "./+types/history.$id";

// Route ressource : GET /sales/pos/:id/history
// Utilisée par PosHistoryModal via useFetcher().load(...)
export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get(`/dsm/pos/${params.id}/history`);
    return data(response.data);
  } catch (error: any) {
    return data(
      { success: false, data: { data: [] }, error: error.response?.data?.message || "Failed to load history" },
      { status: error.response?.status || 500 }
    );
  }
}
