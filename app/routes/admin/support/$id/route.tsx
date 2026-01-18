import { data, useLoaderData, useActionData, useRevalidator } from "react-router";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { isAdmin } from "~/lib/permissions";
import { Layout, ProtectedRoute, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Card, CardContent, CardHeader, CardTitle, Button, Toaster } from "~/components";
import { usePageTitle } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type UpdateSupportTicketData, type ReplySupportTicketData } from "~/lib/services/support.service";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { LoaderData, ActionData } from "./types";
import {
  TicketHeader,
  TicketDetails,
  TicketMessages,
  ClientInfo,
  ReplyForm,
  UpdateForm,
  AnimatedBackground,
} from "./components";
import { validateReplyMessage, validateAttachment } from "./utils";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    const hasAccess = user ? isAdmin(user) : false;

    if (!hasAccess) {
      const language = (await getLanguage(request)) as Language;
      const t = getTranslations(language);
      return data<LoaderData>({
        user,
        hasAccess: false,
        error: t.pages?.unauthorized?.title || "Accès refusé",
        ticket: null,
      });
    }

    const api = await createAuthenticatedApi(request);
    const ticketId = params.id;

    if (!ticketId) {
      return data<LoaderData>({
        user,
        hasAccess: true,
        error: "ID de ticket invalide",
        ticket: null,
      });
    }

    const ticket = await supportService.getTicket(ticketId, api);

    return data<LoaderData>({
      user,
      hasAccess: true,
      error: null,
      ticket,
    });
  } catch (error: any) {
    console.error("Error loading support ticket:", error);
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);
    
    return data<LoaderData>({
      user: null,
      hasAccess: false,
      error: error.message || t.pages?.support?.errors?.fetchFailed || "Erreur lors du chargement",
      ticket: null,
    });
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    const user = await getCurrentUser(request);
    const hasAccess = user ? isAdmin(user) : false;

    if (!hasAccess) {
      return data<ActionData>(
        {
          success: false,
          error: t.pages?.unauthorized?.title || "Accès refusé",
        },
        { status: 403 }
      );
    }

    const api = await createAuthenticatedApi(request);
    const ticketId = params.id;
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    if (!ticketId) {
      return data<ActionData>(
        {
          success: false,
          error: "ID de ticket invalide",
        },
        { status: 400 }
      );
    }

    if (intent === "update") {
      const statusValue = formData.get("status") as string;
      const priorityValue = formData.get("priority") as string;
      
      const errors: { status?: string; priority?: string } = {};
      
      if (!statusValue) {
        errors.status = "Le statut est requis";
      }
      
      if (!priorityValue) {
        errors.priority = "La priorité est requise";
      }
      
      if (Object.keys(errors).length > 0) {
        return data<ActionData>(
          {
            success: false,
            error: "Veuillez corriger les erreurs du formulaire",
            errors,
            intent: "update",
          },
          { status: 400 }
        );
      }

      const updateData: UpdateSupportTicketData = {
        status: statusValue as any,
        priority: priorityValue as any,
        assigned_to: formData.get("assigned_to") as string || undefined,
      };

      await supportService.updateTicket(ticketId, updateData, api);

      return data<ActionData>({
        success: true,
        message: t.pages?.support?.messages?.updated || "Ticket mis à jour avec succès",
        intent: "update",
      });
    } else if (intent === "reply") {
      const message = formData.get("message") as string;
      const isPublicValue = formData.get("is_public");
      const isInternalValue = formData.get("is_internal");
      const is_public = isPublicValue === "true" || isPublicValue === "1";
      const is_internal = isInternalValue === "true" || isInternalValue === "1";

      // Récupérer le fichier d'attachement (une seule image)
      const attachmentFile = formData.get("attachment");
      const attachment = attachmentFile instanceof File ? attachmentFile : null;

      const errors: { message?: string; attachment?: string } = {};

      // Validation du message
      const messageError = validateReplyMessage(message || "", language);
      if (messageError) {
        errors.message = messageError;
      }

      // Validation du fichier (optionnel)
      if (attachment) {
        const attachmentError = validateAttachment(attachment, language);
        if (attachmentError) {
          errors.attachment = attachmentError;
        }
      }

      if (Object.keys(errors).length > 0) {
        return data<ActionData>(
          {
            success: false,
            error: language === 'fr' 
              ? "Veuillez corriger les erreurs du formulaire"
              : "Please correct form errors",
            errors,
            intent: "reply",
          },
          { status: 400 }
        );
      }

      // Créer FormData ou objet pour l'envoi au service
      let replyData: ReplySupportTicketData | FormData;
      
      if (attachment) {
        // Utiliser FormData si on a un fichier
        const replyFormData = new FormData();
        replyFormData.append('message', message.trim());
        if (is_public !== undefined) replyFormData.append('is_public', String(is_public));
        if (is_internal !== undefined) replyFormData.append('is_internal', String(is_internal));
        replyFormData.append('attachment', attachment, attachment.name);
        
        replyData = replyFormData;
      } else {
        // Utiliser objet JSON si pas de fichier
        replyData = {
          message: message.trim(),
          is_public,
          is_internal,
        };
      }

      await supportService.replyToTicket(ticketId, replyData, api);

      return data<ActionData>({
        success: true,
        message: t.pages?.support?.messages?.replied || "Réponse envoyée avec succès",
        intent: "reply",
      });
    }

    return data<ActionData>(
      {
        success: false,
        error: "Action non reconnue",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in support ticket action:", error);
    // Extraire les erreurs de validation de l'API si disponibles
    const apiErrors = error.response?.data?.errors || {};
    const errorMessage = error.response?.data?.message || error.message || t.pages?.support?.errors?.updateFailed || "Erreur lors de l'opération";
    
    // Récupérer l'intent depuis le request (formData est déjà parsé plus haut)
    const formDataObj = await request.formData();
    const errorIntent = formDataObj.get("intent") as string;
    
    return data<ActionData>(
      {
        success: false,
        error: errorMessage,
        errors: apiErrors,
        intent: errorIntent || undefined,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export default function AdminSupportTicketPage({ loaderData }: Route.ComponentProps) {
  usePageTitle("Détails du Ticket");
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const actionData = useActionData<ActionData>();

  const handleSuccess = () => {
    revalidator.revalidate();
  };

  if (!loaderData.hasAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Accès refusé</CardTitle>
            </CardHeader>
            <CardContent>{loaderData.error}</CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!loaderData.ticket) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket introuvable</CardTitle>
              <CardContent>{loaderData.error || "Le ticket demandé n'existe pas"}</CardContent>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/admin/support")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const ticket = loaderData.ticket;

  return (
    <Layout>
      <ProtectedRoute role={['admin', 'super_admin']} mode="any">
        <Toaster />
        <div className="relative min-h-screen overflow-hidden">
          <AnimatedBackground />

          <div className="relative z-10 container mx-auto space-y-6 py-6 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/support">Support</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Détails</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <TicketHeader ticket={ticket} />

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                <TicketDetails ticket={ticket} />
                <TicketMessages messages={ticket.messages} />
                <ReplyForm actionData={actionData} onSuccess={handleSuccess} />
              </div>

              {/* Sidebar - Informations et actions */}
              <div className="space-y-6">
                <ClientInfo ticket={ticket} />
                <UpdateForm ticket={ticket} actionData={actionData} onSuccess={handleSuccess} />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
