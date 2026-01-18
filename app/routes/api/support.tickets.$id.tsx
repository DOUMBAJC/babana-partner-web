import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type UpdateSupportTicketData, type ReplySupportTicketData } from "~/lib/services/support.service";

/**
 * Route API pour récupérer un ticket spécifique
 * GET /api/support/tickets/:id
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const ticketId = params.id;
    
    if (!ticketId) {
      return data(
        { success: false, error: "ID de ticket invalide" },
        { status: 400 }
      );
    }

    const ticket = await supportService.getTicket(ticketId, api);

    return data({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error fetching support ticket:", error);
    
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);

    return data(
      {
        success: false,
        error: error.response?.data?.message || error.message || t.pages.support.errors?.fetchFailed || "Erreur lors de la récupération du ticket",
      },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * Route API pour mettre à jour un ticket (Admin uniquement)
 * PUT /api/support/tickets/:id
 */
export async function action({ request, params }: ActionFunctionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    const api = await createAuthenticatedApi(request);
    const ticketId = params.id;
    
    if (!ticketId) {
      return data(
        { success: false, error: "ID de ticket invalide" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const method = request.method;

    if (method === "PUT" || method === "PATCH") {
      // Mise à jour du ticket
      const updateData: UpdateSupportTicketData = {
        status: body.status,
        priority: body.priority,
        assigned_to: body.assigned_to,
      };

      const ticket = await supportService.updateTicket(ticketId, updateData, api);

      return data({
        success: true,
        data: ticket,
        message: t.pages.support.messages?.updated || "Ticket mis à jour avec succès",
      });
    } else if (method === "POST" && body.message) {
      // Répondre au ticket
      const replyData: ReplySupportTicketData = {
        message: body.message,
        is_public: body.is_public !== false,
        is_internal: body.is_internal,
      };

      const result = await supportService.replyToTicket(ticketId, replyData, api);

      return data({
        success: true,
        ...result,
        message: t.pages.support.messages?.replied || "Réponse envoyée avec succès",
      });
    } else {
      return data(
        { success: false, error: "Méthode non autorisée" },
        { status: 405 }
      );
    }
  } catch (error: any) {
    console.error("Error updating/replying to support ticket:", error);
    
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      t.pages.support.errors?.updateFailed ||
      "Erreur lors de la mise à jour du ticket";

    return data(
      {
        success: false,
        error: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
}

