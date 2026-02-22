import { useNavigate, data, useNavigation } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import { Layout } from '~/components';
import type { Route } from "./+types/route";
import { createAuthenticatedApi } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  ChevronLeft, 
  User as UserIcon, 
  FileCheck, 
  XCircle, 
  MapPin, 
  CreditCard,
  UserCheck,
  Calendar,
  Eye
} from "lucide-react";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApproveDialog } from "../components/ApproveDialog";
import { RejectDialog } from "../components/RejectDialog";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { IdentificationRequest } from "~/types";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get(`/identifications/${params.id}`, {
      params: { include: 'ba,customer,processor' }
    });

    return data({
      request: response.data?.data || response.data,
      error: null,
    });
  } catch (error: any) {
    return data({
      request: null,
      error: error?.message || 'Erreur lors du chargement des détails',
    });
  }
}

export { action } from "../route";

export default function IdentificationDetailsPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { request, error } = loaderData;
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  usePageTitle(request ? `ID #${request.id.slice(0, 8)}` : "Détails Identification");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (!request) {
    return (
      <Layout>
        <div className="container mx-auto p-8 text-center">
          <p className="text-muted-foreground">Demande introuvable</p>
          <Button variant="link" onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approuvé", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeté", className: "bg-red-100 text-red-800" },
      verified: { label: "Vérifié", className: "bg-green-100 text-green-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const docLabels = {
    id_card_front: "Recto Pièce d'Identité",
    id_card_back: "Verso Pièce d'Identité",
    portrait_photo: "Photo Portrait",
    localization_plan: "Plan de Localisation",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à la liste
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">Identification de {request.customer?.full_name}</h1>
              {getStatusBadge(request.status)}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              Soumis le {format(new Date(request.submitted_at), "dd MMMM yyyy HH:mm", { locale: fr })}
            </p>
          </div>

          {request.status === 'pending' && (
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                onClick={() => setShowRejectDialog(true)} 
                variant="outline" 
                className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button 
                onClick={() => setShowApproveDialog(true)} 
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Infos Client */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-primary" />
                Informations Client
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Nom Complet</p>
                  <p className="font-medium">{request.customer?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Téléphone</p>
                  <p className="font-medium">{request.customer?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Type de Pièce</p>
                  <p className="font-medium">{request.customer?.id_card_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Numéro de Pièce</p>
                  <p className="font-medium font-mono">{request.customer?.id_card_number}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Soumis par (BA)
              </h3>
              <p className="font-medium">{request.ba?.name}</p>
              <p className="text-sm text-muted-foreground">{request.ba?.email}</p>
            </Card>
          </div>

          {/* Documents */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Documents d'Identité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['id_card_front', 'id_card_back', 'portrait_photo', 'localization_plan'].map((type) => {
                const url = (request.customer as any)?.[type];
                return (
                  <Card key={type} className="overflow-hidden bg-muted/20 relative group">
                    <div className="p-3 bg-white/10 backdrop-blur-sm absolute top-0 left-0 right-0 z-10 border-b border-border/10">
                      <p className="text-xs font-bold truncate">{(docLabels as any)[type]}</p>
                    </div>
                    {url ? (
                      <>
                        <img 
                          src={url} 
                          alt={(docLabels as any)[type]} 
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                        <XCircle className="h-8 w-8 opacity-20" />
                        <p className="text-xs">Document manquant</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {request.rejection_reason && (
              <Card className="p-6 mt-6 border-red-200 bg-red-50 dark:bg-red-950/20">
                <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Motif du Rejet
                </h3>
                <p className="text-sm">{request.rejection_reason}</p>
              </Card>
            )}
            
            {request.admin_notes && (
              <Card className="p-6 mt-6 bg-muted/30">
                <h3 className="font-semibold mb-2">Notes Administratives</h3>
                <p className="text-sm italic">{request.admin_notes}</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ApproveDialog 
        open={showApproveDialog} 
        onOpenChange={setShowApproveDialog} 
        request={request}
      />
      <RejectDialog 
        open={showRejectDialog} 
        onOpenChange={setShowRejectDialog} 
        request={request}
      />
    </Layout>
  );
}
