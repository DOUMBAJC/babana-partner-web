import type { Route } from "./+types/route";
import { data, type ActionFunctionArgs } from "react-router";
import { Layout } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import { useSupportForm } from "./hooks/useSupportForm";
import { SupportForm, SupportHeader, SupportSidebar, SupportStats } from "./components";
import { createAuthenticatedApi } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService } from "~/lib/services/support.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Support - BABANA Partner" },
    { name: "description", content: "Contactez notre équipe de support pour toute assistance" },
  ];
}

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
    
    // Avec useSubmit, React Router gère automatiquement FormData en multipart/form-data
    // Parser directement comme FormData (comme dans customer/identify)
    const formData = await request.formData();
    
    // Debug: Vérifier le Content-Type reçu
    const contentType = request.headers.get("content-type") || "";
    console.log(`[Support Action] Content-Type: ${contentType}`);
    console.log(`[Support Action] FormData keys:`, Array.from(formData.keys()));
    
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const priority = (formData.get("priority") as string) || "normal";
    
    // Récupérer le fichier d'attachement (une seule image)
    const attachmentFile = formData.get("attachment");
    const attachment = attachmentFile instanceof File ? attachmentFile : null;
    
    if (attachment) {
      console.log(`[Support Action] Attachment received:`, {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      });
    } else {
      console.log(`[Support Action] No attachment received (attachmentFile:`, attachmentFile, `)`);
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

    // Validation du fichier d'attachement (optionnel)
    if (attachment) {
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!allowedTypes.includes(attachment.type)) {
        return data(
          {
            success: false,
            error: language === 'fr'
              ? `Type de fichier non supporté: ${attachment.name}. Types acceptés: JPEG, JPG, PNG, GIF, WEBP`
              : `File type not supported: ${attachment.name}. Accepted types: JPEG, JPG, PNG, GIF, WEBP`,
          },
          { status: 400 }
        );
      }
      if (attachment.size > maxSizeBytes) {
        return data(
          {
            success: false,
            error: language === 'fr'
              ? `Le fichier ${attachment.name} est trop volumineux. Taille maximale: 2MB`
              : `File ${attachment.name} is too large. Maximum size: 2MB`,
          },
          { status: 400 }
        );
      }
    }

    // Créer FormData pour l'envoi au service Laravel
    const ticketFormData = new FormData();
    ticketFormData.append('full_name', full_name.trim());
    ticketFormData.append('email', email.trim());
    ticketFormData.append('subject', subject.trim());
    ticketFormData.append('message', message.trim());
    ticketFormData.append('priority', ticketPriority);
    
    // Ajouter le fichier d'attachement s'il existe
    if (attachment) {
      ticketFormData.append('attachment', attachment, attachment.name);
    }

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

export default function SupportPage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.support.title);

  const {
    formData,
    focusedField,
    isSubmitting,
    isSubmitted,
    error,
    attachment,
    setFocusedField,
    handleChange,
    handlePriorityChange,
    setAttachment,
    handleSubmit,
  } = useSupportForm();

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background avec gradient animé */}
        <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/10 via-transparent to-babana-navy/10 dark:from-babana-cyan/5 dark:via-transparent dark:to-babana-navy/5" />
        
        {/* Effets de particules animées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-babana-navy/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-babana-cyan/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <SupportHeader />

          {/* Grille principale */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Formulaire de contact - 2 colonnes */}
            <div className="lg:col-span-2">
              <SupportForm
                formData={formData}
                focusedField={focusedField}
                isSubmitting={isSubmitting}
                isSubmitted={isSubmitted}
                error={error}
                attachment={attachment}
                onFieldFocus={setFocusedField}
                onChange={handleChange}
                onPriorityChange={handlePriorityChange}
                onAttachmentChange={setAttachment}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Sidebar avec informations de contact */}
            <SupportSidebar />
          </div>

          {/* Section statistiques */}
          <SupportStats />
        </div>
      </div>
    </Layout>
  );
}
