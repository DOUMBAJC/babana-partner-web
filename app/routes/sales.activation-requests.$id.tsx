import { useState, useEffect, useRef } from "react";
import { useNavigate, data, useSubmit, useActionData, useRevalidator } from "react-router";
import { useTranslation, usePageTitle, useLanguage } from '~/hooks';
import { Layout } from '~/components';
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  FileText,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  History,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import type { Route } from "./+types/sales.activation-requests.$id";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { ActivationRequest, RoleSlug } from "~/types";
import { AcceptDialog } from './sales/activation-requests/components/AcceptDialog';
import { RejectDialog } from './sales/activation-requests/components/RejectDialog';
import { EditDialog } from './sales/activation-requests/components/EditDialog';
import { CancelDialog } from './sales/activation-requests/components/CancelDialog';
import { CopyableValue, InfoCard } from './sales/activation-requests/components/CopyButton';
import { toast } from 'sonner';
import { Toaster } from '~/components/ui/toaster';

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
        statusChanged: false,
      });
    }

    const hasAccess = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role));

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null,
        request: null,
        statusChanged: false,
      });
    }

    const api = await createAuthenticatedApi(request);
    const response = await api.get(`/activation-requests/${id}`, {
      params: {
        include: 'ba,customer,processor,history',
      },
    });

    const activationRequest = response.data?.data || response.data;

    const isOwner = activationRequest.baId === user.id;
    const isActivator = user.roles?.some((role) => 
      ['activateur', 'admin', 'super_admin'].includes(role)
    );
    
    // Règles d'accès :
    // - Les activateurs peuvent voir toutes les requêtes
    // - Les BA peuvent voir leurs propres requêtes (quel que soit le statut)
    // - Personne d'autre ne peut voir les requêtes
    if (!isOwner && !isActivator) {
      return data({
        user,
        hasAccess: false,
        error: 'Vous n\'avez pas accès à cette requête',
        request: null,
        statusChanged: false,
      });
    }

    // Optimisation : Changement de statut automatique uniquement si activateur ET pending
    // On utilise le résultat du POST directement s'il retourne l'objet complet
    if (isActivator && activationRequest.status === 'pending') {
      try {
        const processResponse = await api.post(`/activation-requests/${id}/process`, {
          status: 'processing',
          admin_notes: 'Requête ouverte par un activateur'
        });
        
        // Si le backend retourne l'objet complet, on l'utilise directement
        const updatedRequest = processResponse.data?.data || processResponse.data;
        
        // Vérifier si on a reçu un objet complet (avec les relations)
        // Si oui, on évite le deuxième appel GET
        if (updatedRequest && updatedRequest.ba && updatedRequest.customer) {
          return data({
            user,
            hasAccess: true,
            error: null,
            request: updatedRequest,
            statusChanged: true,
          });
        }
        
        // Sinon, on fait un GET pour récupérer l'objet complet
        const updatedResponse = await api.get(`/activation-requests/${id}`, {
          params: {
            include: 'ba,customer,processor,history',
          },
        });
        
        return data({
          user,
          hasAccess: true,
          error: null,
          request: updatedResponse.data?.data || updatedResponse.data,
          statusChanged: true,
        });
      } catch (error) {
        // Continuer même si le changement de statut échoue
        // On retourne la requête originale
      }
    }

    return data({
      user,
      hasAccess: true,
      error: null,
      request: activationRequest,
      statusChanged: false,
    });
  } catch (error: any) {
    // Optimisation : éviter le double appel à getCurrentUser
    // Si on est dans le catch, user est peut-être déjà disponible du try
    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données',
      request: null,
      statusChanged: false,
    });
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;
    const requestId = parseInt(formData.get('requestId') as string);

    const api = await createAuthenticatedApi(request);

    switch (actionType) {
      case 'update': {
        const updateData = {
          sim_number: formData.get('sim_number') as string,
          iccid: formData.get('iccid') as string,
          imei: formData.get('imei') as string || undefined,
          ba_notes: formData.get('baNotes') as string || undefined,
        };

        await api.put(`/activation-requests/${requestId}`, updateData);

        return data({
          success: true,
          message: '✨ Requête modifiée avec succès !',
        });
      }

      case 'cancel': {
        const cancelReason = formData.get('cancelReason') as string;
        
        await api.post(`/activation-requests/${requestId}/cancel`, {
          cancel_reason: cancelReason || 'Annulée par l\'utilisateur',
        });

        return data({
          success: true,
          message: 'Requête annulée avec succès',
        });
      }

      case 'accept': {
        const adminNotes = formData.get('adminNotes') as string;
        
        await api.post(`/activation-requests/${requestId}/accept`, {
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          message: 'Requête acceptée avec succès',
        });
      }

      case 'reject': {
        const rejectionReason = formData.get('rejectionReason') as string;
        const adminNotes = formData.get('adminNotes') as string;

        if (!rejectionReason || !rejectionReason.trim()) {
          return data({
            success: false,
            error: 'La raison du rejet est obligatoire',
          }, { status: 400 });
        }
        
        await api.post(`/activation-requests/${requestId}/reject`, {
          rejection_reason: rejectionReason,
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          message: 'Requête rejetée avec succès',
        });
      }

      case 'process': {
        const status = formData.get('status') as string || 'processing';
        const adminNotes = formData.get('adminNotes') as string;
        
        await api.post(`/activation-requests/${requestId}/process`, {
          status,
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          message: 'Requête marquée en traitement',
        });
      }

      default:
        return data({
          success: false,
          error: 'Action non reconnue',
        }, { status: 400 });
    }
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    const errorMessage = backendMessage || error?.message || 'Une erreur est survenue';
    
    return data({
      success: false,
      error: errorMessage,
    }, { status: error?.response?.status || 500 });
  }
}

export default function ActivationRequestDetailPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const revalidator = useRevalidator();

  usePageTitle(t.activationRequests.details.title);

  const { user, hasAccess, error: loaderError, request, statusChanged } = loaderData;
  const isAuthenticated = !!user;

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Ref pour éviter les toasts en double lors du Strict Mode
  const statusChangedShown = useRef(false);

  // Afficher un message si le statut a été changé automatiquement
  useEffect(() => {
    if (statusChanged && !statusChangedShown.current) {
      toast.info('⚡ Cette requête est maintenant en cours de traitement');
      statusChangedShown.current = true;
    }
  }, [statusChanged]);

  // Gérer les réponses des actions (sans afficher de toast car les dialogues s'en occupent)
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        // Recharger les données après une action réussie
        setTimeout(() => {
          revalidator.revalidate();
        }, 500);
      } else if ('error' in actionData && actionData.error) {
        // Afficher les erreurs uniquement (les dialogues affichent déjà les succès)
        toast.error(actionData.error);
      }
    }
  }, [actionData, revalidator]);

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        label: t.activationRequests.status.pending, 
        className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0",
        icon: Clock,
        iconColor: "text-white animate-pulse"
      },
      processing: { 
        label: t.activationRequests.status.processing, 
        className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0",
        icon: Zap,
        iconColor: "text-white animate-bounce"
      },
      approved: { 
        label: t.activationRequests.status.activated, 
        className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0",
        icon: CheckCircle,
        iconColor: "text-white"
      },
      activated: { 
        label: t.activationRequests.status.activated, 
        className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0",
        icon: CheckCircle,
        iconColor: "text-white"
      },
      rejected: { 
        label: t.activationRequests.status.rejected, 
        className: "bg-gradient-to-r from-red-500 to-pink-600 text-white border-0",
        icon: XCircle,
        iconColor: "text-white"
      },
      cancelled: { 
        label: t.activationRequests.status.cancelled, 
        className: "bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0",
        icon: AlertCircle,
        iconColor: "text-white"
      },
    };

    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} px-4 py-2 flex items-center gap-2 text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
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

  const getUserRole = () => user?.roles?.[0];

  const canEditRequest = (request: ActivationRequest | null) => {
    if (!request) return false;
    const userRole = getUserRole();
    
    // L'utilisateur doit être le propriétaire pour modifier
    const isOwner = request.baId === user?.id;
    
    // BA, DSM, POS peuvent éditer leurs propres requêtes si elles sont pending ou rejected
    if (['ba', 'dsm', 'pos'].includes(userRole || '')) {
      return (request.status === 'pending' || request.status === 'rejected') && isOwner;
    }
    
    // Admin et super_admin peuvent toujours éditer
    return ['admin', 'super_admin'].includes(userRole || '');
  };

  const canCancelRequest = (request: ActivationRequest | null) => {
    if (!request) return false;
    
    // L'utilisateur doit être le propriétaire
    const isOwner = request.baId === user?.id;
    
    // Seul le owner peut annuler et seulement si la requête est en statut pending
    return isOwner && request.status === 'pending';
  };

  const canProcessRequest = (request: ActivationRequest | null) => {
    if (!request) return false;
    const userRole = getUserRole();
    
    // Seuls les activateurs peuvent accepter/rejeter
    const isActivator = ['activateur', 'admin', 'super_admin'].includes(userRole || '');
    
    // Peut traiter si la requête est pending ou processing
    return isActivator && (request.status === 'pending' || request.status === 'processing');
  };

  // Rediriger si l'utilisateur n'a pas accès
  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, hasAccess, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  if (!request) {
    return (
      <Layout>
        <Toaster />
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-red-500 to-pink-600 mx-auto flex items-center justify-center shadow-2xl">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Requête introuvable
              </h1>
              <p className="text-muted-foreground text-lg">
                {loaderError || "La requête d'activation demandée n'existe pas ou vous n'avez pas accès à celle-ci."}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/sales/activation-requests')}
              className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster />
      
      {/* Background gradient animé */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête avec navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/sales/activation-requests')}
            className="mb-6 hover:bg-accent/50 border border-border/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>

          {/* Titre et statut */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    Requête #{request.id}
                    <Sparkles className="h-7 w-7 text-amber-500 animate-pulse" />
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Créée le {formatDate(request.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(request.status)}
                {request.processed_at && (
                  <Badge variant="outline" className="px-3 py-1 border-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Traitée le {formatDate(request.processed_at)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions principales */}
            <div className="flex flex-wrap gap-3">
              {canProcessRequest(request) && (
                <>
                  <Button
                    onClick={() => setShowAcceptDialog(true)}
                    size="lg"
                    className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Accepter
                  </Button>
                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    size="lg"
                    className="bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rejeter
                  </Button>
                </>
              )}
              
              {canEditRequest(request) && (
                <Button
                  onClick={() => setShowEditDialog(true)}
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Modifier
                </Button>
              )}
              
              {canCancelRequest(request) && (
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Annuler
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Grille de cartes d'information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Informations Client */}
          <InfoCard
            icon={<User className="h-6 w-6" />}
            title="Informations Client"
            gradient="bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500"
          >
            <CopyableValue
              label="Nom complet"
              value={request.customer?.full_name?.toUpperCase() || '-'}
              highlight
              icon={<User className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            <CopyableValue
              label="Téléphone"
              value={request.customer?.phone || '-'}
              mono
              icon={<Phone className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            <CopyableValue
              label="Type de pièce"
              value={request.customer?.id_card_type?.name || '-'}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            <CopyableValue
              label="Numéro de pièce"
              value={request.customer?.id_card_number || '-'}
              mono
              icon={<Shield className="h-4 w-4" />}
            />
          </InfoCard>

          {/* Informations SIM */}
          <InfoCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Informations SIM"
            gradient="bg-linear-to-r from-purple-500 via-pink-500 to-rose-500"
          >
            <CopyableValue
              label="Numéro SIM"
              value={request.sim_number}
              highlight
              mono
              icon={<Zap className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            <CopyableValue
              label="ICCID"
              value={request.iccid}
              mono
              icon={<CreditCard className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            {request.imei ? (
              <CopyableValue
                label="IMEI"
                value={request.imei}
                mono
                icon={<Shield className="h-4 w-4" />}
              />
            ) : (
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">IMEI</p>
                <p className="text-sm text-muted-foreground italic mt-2">Non fourni</p>
              </div>
            )}
          </InfoCard>

          {/* Informations BA */}
          <InfoCard
            icon={<User className="h-6 w-6" />}
            title="Business Advisor"
            gradient="from-orange-500 via-amber-500 to-yellow-500"
          >
            <CopyableValue
              label="Nom"
              value={request.ba?.name || '-'}
              icon={<User className="h-4 w-4" />}
            />
            <Separator className="my-3" />
            <CopyableValue
              label="Email"
              value={request.ba?.email || '-'}
              mono
              icon={<FileText className="h-4 w-4" />}
            />
            {request.ba?.camtelLogin && (
              <>
                <Separator className="my-3" />
                <CopyableValue
                  label="Login Camtel"
                  value={request.ba.camtelLogin}
                  mono
                  icon={<Shield className="h-4 w-4" />}
                />
              </>
            )}
          </InfoCard>

          {/* Notes et Détails */}
          <InfoCard
            icon={<FileText className="h-6 w-6" />}
            title="Notes et Commentaires"
            gradient="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500"
          >
            {request.ba_notes ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Notes BA
                  </p>
                  <p className="text-sm bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 font-medium">
                    {request.ba_notes}
                  </p>
                </div>
                <Separator className="my-3" />
              </>
            ) : null}
            
            {request.admin_notes ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 text-blue-500" />
                    Notes Admin
                  </p>
                  <p className="text-sm bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700 font-medium">
                    {request.admin_notes}
                  </p>
                </div>
                <Separator className="my-3" />
              </>
            ) : null}
            
            {request.rejection_reason ? (
              <>
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <XCircle className="h-3 w-3" />
                    Raison du rejet
                  </p>
                  <p className="text-sm bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-4 rounded-xl border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-medium">
                    {request.rejection_reason}
                  </p>
                </div>
                <Separator className="my-3" />
              </>
            ) : null}
            
            {request.processor ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Traité par
                </p>
                <div className="flex items-center gap-3 p-3 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{request.processor.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{request.processor.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Aucune note disponible
              </p>
            )}
          </InfoCard>
        </div>

        {/* Historique (si disponible) */}
        {request.history && request.history.length > 0 && (
          <InfoCard
            icon={<History className="h-6 w-6" />}
            title="Historique des modifications"
            gradient="from-indigo-500 via-purple-500 to-pink-500"
            className="animate-fade-in"
          >
            <div className="space-y-4">
              {request.history.map((entry: any, index: number) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    {index < request.history!.length - 1 && (
                      <div className="w-0.5 flex-1 bg-linear-to-b from-purple-500 to-pink-600 mt-2 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-accent/50 p-4 rounded-xl border-2 border-border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-foreground">{entry.action}</p>
                          {entry.user && (
                            <p className="text-sm text-muted-foreground mt-1">
                              par <span className="font-semibold text-primary">{entry.user.name}</span>
                            </p>
                          )}
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              "{entry.notes}"
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap bg-accent px-3 py-1 rounded-full font-mono">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        )}
      </div>

      {/* Dialogues */}
      {request && (
        <>
          <AcceptDialog
            open={showAcceptDialog}
            onOpenChange={setShowAcceptDialog}
            request={request}
            action={`/sales/activation-requests/${request.id}`}
          />
          <RejectDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            request={request}
            action={`/sales/activation-requests/${request.id}`}
          />
          <EditDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            request={request}
            action={`/sales/activation-requests/${request.id}`}
          />
          <CancelDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            request={request}
            action={`/sales/activation-requests/${request.id}`}
          />
        </>
      )}
    </Layout>
  );
}
