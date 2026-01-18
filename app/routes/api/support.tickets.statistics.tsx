import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService } from "~/lib/services/support.service";

/**
 * Route API pour obtenir les statistiques des tickets
 * GET /api/support/tickets/statistics
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const statistics = await supportService.getStatistics(api);

    return data({
      success: true,
      data: statistics,
    });
  } catch (error: any) {
    console.error("Error fetching support statistics:", error);
    
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);

    return data(
      {
        success: false,
        error: error.response?.data?.message || error.message || t.pages.support.errors?.statsFailed || "Erreur lors de la récupération des statistiques",
      },
      { status: error.response?.status || 500 }
    );
  }
}

