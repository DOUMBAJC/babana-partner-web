import { data, type ActionFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type SupportTicketData } from "~/lib/services/support.service";

/**
 * Route API pour créer un ticket de support
 * POST /api/support
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    // Le endpoint /support/tickets est accessible sans authentification
    // On essaie d'obtenir l'API authentifiée si disponible, sinon on utilise l'API publique
    let api;
    try {
      api = await createAuthenticatedApi(request);
    } catch {
      // Si l'utilisateur n'est pas authentifié, créer une API publique
      const { createApiFromRequest } = await import("~/services/api.server");
      api = await createApiFromRequest(request);
    }
    
    // Vérifier si c'est FormData (avec fichiers) ou JSON
    const contentType = request.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");
    
    let full_name: string;
    let email: string;
    let subject: string;
    let message: string;
    let priority: string;
    let attachments: File[] = [];

    if (isFormData) {
      const formData = await request.formData();
      full_name = formData.get("full_name") as string;
      email = formData.get("email") as string;
      subject = formData.get("subject") as string;
      message = formData.get("message") as string;
      priority = (formData.get("priority") as string) || "normal";
      
      // Récupérer les fichiers d'attachement
      // Laravel accepte les deux formats : attachments[] ou attachments[0], attachments[1], etc.
      // Les deux formats fonctionnent avec la validation 'attachments.*'
      const attachmentEntries = Array.from(formData.entries())
        .filter(([key, value]) => {
          const keyStr = key.toString();
          // Accepter attachments[] ou attachments[0], attachments[1], etc.
          const isAttachmentKey = keyStr === "attachments[]" || keyStr.startsWith("attachments[");
          const isFile = value instanceof File;
          
          if (isAttachmentKey && isFile) {
            console.log(`[Support API] Found attachment: ${keyStr}, file: ${(value as File).name}, type: ${(value as File).type}, size: ${(value as File).size} bytes`);
          }
          
          return isAttachmentKey && isFile;
        });
      attachments = attachmentEntries
        .map(([, file]) => file as File)
        .filter((file): file is File => file instanceof File);
      
      console.log(`[Support API] Total attachments received: ${attachments.length}`);
    } else {
      const body = await request.json();
      full_name = body.full_name;
      email = body.email;
      subject = body.subject;
      message = body.message;
      priority = body.priority || "normal";
    }

    if (!full_name || !email || !subject || !message) {
      return data(
        {
          success: false,
          error: t.pages.support.form.errors?.requiredFields || "Tous les champs sont requis",
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return data(
        {
          success: false,
          error: t.pages.support.form.errors?.invalidEmail || "Email invalide",
        },
        { status: 400 }
      );
    }

    // Validation de la priorité
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    const ticketPriority = priority || 'normal';
    if (!validPriorities.includes(ticketPriority)) {
      return data(
        {
          success: false,
          error: t.pages.support.form.errors?.invalidPriority || "Priorité invalide",
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

    // Créer FormData pour l'envoi au service
    const ticketFormData = new FormData();
    ticketFormData.append('full_name', full_name.trim());
    ticketFormData.append('email', email.trim());
    ticketFormData.append('subject', subject.trim());
    ticketFormData.append('message', message.trim());
    ticketFormData.append('priority', ticketPriority);
    
    // Ajouter les fichiers - Laravel attend un tableau avec attachments[]
    // Utiliser attachments[] pour que Laravel reconnaisse correctement le tableau
    attachments.forEach((file) => {
      ticketFormData.append('attachments[]', file, file.name);
    });

    // Créer le ticket avec FormData
    const ticket = await supportService.createTicket(ticketFormData, api);

    return data({
      success: true,
      ticket,
      message: t.pages.support.form.success.message || "Votre message a été envoyé avec succès",
    });
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      t.pages.support.form.errors?.submitFailed ||
      "Erreur lors de l'envoi du message";

    return data(
      {
        success: false,
        error: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
}

