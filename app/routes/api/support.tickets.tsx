import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type SupportTicketFilters } from "~/lib/services/support.service";

/**
 * Route API pour lister les tickets de support
 * GET /api/support/tickets
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const url = new URL(request.url);
    
    const filters: SupportTicketFilters = {
      status: url.searchParams.get("status") as any || undefined,
      priority: url.searchParams.get("priority") as any || undefined,
      assigned_to: url.searchParams.get("assigned_to") || undefined,
      search: url.searchParams.get("search") || undefined,
      per_page: url.searchParams.get("per_page") ? parseInt(url.searchParams.get("per_page")!) : 15,
    };

    const tickets = await supportService.getTickets(filters, undefined, api);

    return data({
      success: true,
      ...tickets,
    });
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);

    return data(
      {
        success: false,
        error: error.response?.data?.message || error.message || t.pages.support.errors?.fetchFailed || "Erreur lors de la récupération des tickets",
        data: [],
      },
      { status: error.response?.status || 500 }
    );
  }
}

