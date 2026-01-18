import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type ReplySupportTicketData } from "~/lib/services/support.service";

/**
 * Route API pour répondre à un ticket (Admin uniquement)
 * POST /api/support/tickets/:id/reply
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

    // Vérifier si c'est FormData (avec fichiers) ou JSON
    const contentType = request.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");
    
    let message: string;
    let is_public: boolean | undefined;
    let is_internal: boolean | undefined;
    let attachments: File[] = [];

    if (isFormData) {
      const formData = await request.formData();
      message = formData.get("message") as string;
      const isPublicValue = formData.get("is_public");
      const isInternalValue = formData.get("is_internal");
      is_public = isPublicValue === "true" || isPublicValue === "1";
      is_internal = isInternalValue === "true" || isInternalValue === "1";
      
      // Récupérer les fichiers d'attachement
      // Laravel attend attachments[] pour la validation 'attachments.*'
      const attachmentEntries = Array.from(formData.entries())
        .filter(([key, value]) => {
          const keyStr = key.toString();
          return (keyStr === "attachments[]" || keyStr.startsWith("attachments[")) && value instanceof File;
        });
      attachments = attachmentEntries
        .map(([, file]) => file as File)
        .filter((file): file is File => file instanceof File);
    } else {
      const body = await request.json();
      message = body.message;
      is_public = body.is_public;
      is_internal = body.is_internal;
    }

    // Validation du message
    if (!message || !message.trim()) {
      return data(
        { success: false, error: t.pages.support.form.errors?.requiredFields || "Le message est requis" },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      return data(
        {
          success: false,
          error: language === 'fr'
            ? "Le message doit contenir au moins 10 caractères"
            : "Message must be at least 10 characters",
        },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 2000) {
      return data(
        {
          success: false,
          error: language === 'fr'
            ? "Le message ne peut pas dépasser 2000 caractères"
            : "Message cannot exceed 2000 characters",
        },
        { status: 400 }
      );
    }

    // Validation des fichiers d'attachement
    if (attachments.length > 3) {
      return data(
        {
          success: false,
          error: language === 'fr' 
            ? "Vous ne pouvez joindre que 3 images maximum"
            : "You can only attach up to 3 images",
        },
        { status: 400 }
      );
    }

    // Valider chaque fichier
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    for (const file of attachments) {
      if (!allowedTypes.includes(file.type)) {
        return data(
          {
            success: false,
            error: language === 'fr'
              ? `Type de fichier non supporté: ${file.name}. Types acceptés: JPEG, JPG, PNG, GIF, WEBP`
              : `File type not supported: ${file.name}. Accepted types: JPEG, JPG, PNG, GIF, WEBP`,
          },
          { status: 400 }
        );
      }
      if (file.size > maxSizeBytes) {
        return data(
          {
            success: false,
            error: language === 'fr'
              ? `Le fichier ${file.name} est trop volumineux. Taille maximale: 2MB`
              : `File ${file.name} is too large. Maximum size: 2MB`,
          },
          { status: 400 }
        );
      }
    }

    // Créer FormData ou objet pour l'envoi au service
    let replyData: ReplySupportTicketData | FormData;
    
    if (isFormData && attachments.length > 0) {
      // Utiliser FormData si on a des fichiers
      const replyFormData = new FormData();
      replyFormData.append('message', trimmedMessage);
      if (is_public !== undefined) replyFormData.append('is_public', String(is_public));
      if (is_internal !== undefined) replyFormData.append('is_internal', String(is_internal));
      
      // Utiliser attachments[] pour que Laravel reconnaisse correctement le tableau
      attachments.forEach((file) => {
        replyFormData.append('attachments[]', file, file.name);
      });
      
      replyData = replyFormData;
    } else {
      // Utiliser JSON si pas de fichiers
      replyData = {
        message: trimmedMessage,
        is_public,
        is_internal,
      };
    }

    console.log(`[Support Reply API] Replying to ticket ${ticketId} with ${attachments.length} attachment(s)`);

    const result = await supportService.replyToTicket(ticketId, replyData, api);

    return data({
      success: true,
      ...result,
      message: t.pages.support.messages?.replied || "Réponse envoyée avec succès",
    });
  } catch (error: any) {
    console.error("Error replying to support ticket:", error);
    
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      t.pages.support.errors?.replyFailed ||
      "Erreur lors de l'envoi de la réponse";

    return data(
      {
        success: false,
        error: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
}

