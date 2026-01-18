import { data, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { Layout, ProtectedRoute, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator } from "~/components";
import { usePageTitle, useTranslation } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type SupportTicket } from "~/lib/services/support.service";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  User as UserIcon,
  Mail,
  FileText,
} from "lucide-react";
import type { User } from "~/types/auth.types";
import { StatusBadge, PriorityBadge } from "~/routes/admin/support/components";

type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  error: string | null;
  ticket: SupportTicket | null;
};

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      const language = (await getLanguage(request)) as Language;
      const t = getTranslations(language);
      return data({
        user: null,
        hasAccess: false,
        error: t.pages?.unauthorized?.title || "Vous devez être connecté pour voir ce ticket",
        ticket: null,
      });
    }

    const api = await createAuthenticatedApi(request);
    const ticketId = params.id;

    if (!ticketId) {
      return data({
        user,
        hasAccess: true,
        error: "ID de ticket invalide",
        ticket: null,
      });
    }

    const ticket = await supportService.getTicket(ticketId, api);

    // Vérifier que l'utilisateur est propriétaire du ticket ou admin
    if (ticket.email !== user.email && !user.roles?.includes("admin") && !user.roles?.includes("super_admin")) {
      const language = (await getLanguage(request)) as Language;
      const t = getTranslations(language);
      return data({
        user,
        hasAccess: false,
        error: t.pages?.unauthorized?.title || "Vous n'avez pas accès à ce ticket",
        ticket: null,
      });
    }

    return data({
      user,
      hasAccess: true,
      error: null,
      ticket,
    });
  } catch (error: any) {
    console.error("Error loading support ticket:", error);
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);
    
    return data({
      user: null,
      hasAccess: false,
      error: error.message || t.pages?.support?.errors?.fetchFailed || "Erreur lors du chargement",
      ticket: null,
    });
  }
}

export default function SupportTicketDetailPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle("Détails du Ticket");
  const navigate = useNavigate();

  if (!loaderData.hasAccess || !loaderData.ticket) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Erreur</CardTitle>
              <CardDescription>{loaderData.error || "Ticket introuvable"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/support/tickets")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à mes tickets
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
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/support/tickets")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes tickets
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{ticket.subject}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {ticket.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Message
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{ticket.message}</p>
                  </div>
                </div>

                {ticket.messages && ticket.messages.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Réponses ({ticket.messages.length})
                    </h3>
                    <div className="space-y-4">
                      {ticket.messages.map((reply: any, index: number) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {reply.user?.name || "Support"}
                                </span>
                                {reply.is_public === false && (
                                  <Badge variant="outline" className="text-xs">
                                    Interne
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(reply.created_at).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

