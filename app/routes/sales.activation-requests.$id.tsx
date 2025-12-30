import { useState, useEffect } from "react";
import { useNavigate, data } from "react-router";
import { useTranslation, usePageTitle, useLanguage } from '~/hooks';
import { Layout } from '~/components';
import { Loader2, ArrowLeft, User, Phone, CreditCard, Calendar, FileText } from "lucide-react";
import type { Route } from "./+types/sales.activation-requests.$id";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { ActivationRequest, RoleSlug } from "~/types";
import { AcceptDialog } from './sales/activation-requests/components/AcceptDialog';
import { RejectDialog } from './sales/activation-requests/components/RejectDialog';

const AUTHORIZED_ROLES: RoleSlug[] = ['super_admin', 'admin', 'activateur', 'ba', 'dsm', 'pos'];

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    const { id } = params;

    if (!user) {
      return data({
        user: null,
        hasAccess: false,
        error: null,
        request: null,
      });
    }

    const hasAccess = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role));
    

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null,
        request: null,
      });
    }

    const api = await createAuthenticatedApi(request);
    const response = await api.get(`/activation-requests/${id}`, {
      params: {
        include: 'ba,customer,processor,history',
      },
    });

    return data({
      user,
      hasAccess: true,
      error: null,
      request: response.data?.data || response.data,
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);

    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données',
      request: null,
    });
  }
}

export default function ActivationRequestDetailPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  usePageTitle(t.activationRequests.details.title);

  const { user, hasAccess, error: loaderError, request } = loaderData;
  const isAuthenticated = !!user;

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t.activationRequests.status.pending, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      processing: { label: t.activationRequests.status.processing, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      activated: { label: t.activationRequests.status.activated, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      rejected: { label: t.activationRequests.status.rejected, className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      cancelled: { label: t.activationRequests.status.cancelled, className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    try {
      const dateLocale = language === 'fr' ? fr : enUS;
      return format(new Date(date), "dd MMMM yyyy à HH:mm", { locale: dateLocale });
    } catch {
      return date;
    }
  };

  const canProcessRequest = (request: ActivationRequest | null) => {
    if (!request) return false;
    const userRole = user?.roles?.[0];
    return (userRole === 'activateur' || userRole === 'ba' || userRole === 'dsm' || userRole === 'pos' ||
            userRole === 'admin' || 
            userRole === 'super_admin') &&
           request.status === 'pending';
  };

  // Rediriger si l'utilisateur n'a pas accès
  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, hasAccess, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  if (!request) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="p-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t.activationRequests.notFound}
            </h1>
            <Button onClick={() => navigate('/sales/activation-requests')}>
              {t.activationRequests.details.backToList}
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* En-tête */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/sales/activation-requests')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.activationRequests.details.backToList}
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t.activationRequests.details.title} #{request.id}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(request.createdAt)}
                </span>
                {getStatusBadge(request.status)}
              </div>
            </div>

            {canProcessRequest(request) && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAcceptDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t.activationRequests.table.accept}
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                >
                  {t.activationRequests.table.reject}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations Client */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.activationRequests.details.customerInfo}</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.fullName}</p>
                <p className="text-lg font-medium text-amber-300 dark:text-amber-600">
                  {request.customer?.full_name.toUpperCase() || t.activationRequests.details.notProvided}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.phone}</p>
                <p className="font-medium flex items-center gap-2 text-amber-300 dark:text-amber-600">
                  <Phone className="h-4 w-4" />
                  {request.customer?.phone || t.activationRequests.details.notProvided}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.cardType}</p>
                <p className="font-medium text-amber-300 dark:text-amber-600">
                  {request.customer?.id_card_type?.name || t.activationRequests.details.notProvided}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.cardNumber}</p>
                <p className="font-mono font-medium text-amber-300 dark:text-amber-600">
                  {request.customer?.id_card_number || t.activationRequests.details.notProvided}
                </p>
              </div>
            </div>
          </Card>

          {/* Informations SIM */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.activationRequests.details.simInfo}</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.table.simNumber}</p>
                <p className="text-lg font-mono font-medium text-amber-300 dark:text-amber-600">
                  {request.sim_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.table.iccid}</p>
                <p className="font-mono text-sm font-medium text-amber-300 dark:text-amber-600">
                  {request.iccid}
                </p>
              </div>
              {request.imei && (
                <div>
                  <p className="text-sm text-muted-foreground">IMEI</p>
                  <p className="font-mono text-sm font-medium text-amber-300 dark:text-amber-600">
                    {request.imei}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Informations BA */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.activationRequests.details.baInfo}</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.name}</p>
                <p className="font-medium text-amber-300 dark:text-amber-600">
                  {request.ba?.name || t.activationRequests.details.notProvided}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.activationRequests.details.email}</p>
                <p className="font-medium text-amber-300 dark:text-amber-600">
                  {request.ba?.email || t.activationRequests.details.notProvided}
                </p>
              </div>
            </div>
          </Card>

          {/* Notes et Détails */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.activationRequests.details.notesDetails}</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              {request.baNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.activationRequests.details.baNotes}</p>
                  <p className="font-medium text-amber-300 dark:text-amber-600">
                    {request.baNotes}
                  </p>
                </div>
              )}
              {request.adminNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.activationRequests.details.adminNotes}</p>
                  <p className="font-medium text-amber-300 dark:text-amber-600">
                    {request.adminNotes}
                  </p>
                </div>
              )}
              {request.rejectionReason && (
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">{t.activationRequests.details.rejectionReason}</p>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    {request.rejectionReason}
                  </p>
                </div>
              )}
              {request.processedBy && request.processor && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.activationRequests.details.processedBy}</p>
                  <p className="font-medium">
                    {request.processor.name}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogues */}
      {request && (
        <>
          <AcceptDialog
            open={showAcceptDialog}
            onOpenChange={setShowAcceptDialog}
            request={request}
          />
          <RejectDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            request={request}
          />
        </>
      )}
    </Layout>
  );
}

