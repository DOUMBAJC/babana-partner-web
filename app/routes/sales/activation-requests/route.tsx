import { useNavigate, data, useNavigation } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import { Layout } from '~/components';
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { StatsCards } from './components/StatsCards';
import { FiltersSection } from './components/FiltersSection';
import { RequestsTable } from './components/RequestsTable';
import { AccessDenied } from './components/AccessDenied';
import type { RoleSlug } from '~/types';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { LoadingOverlay } from '~/components/ui/loading-overlay';

const AUTHORIZED_ROLES: RoleSlug[] = ['super_admin', 'admin', 'activateur', 'ba', 'dsm', 'pos'];

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data({
        user: null,
        hasAccess: false,
        error: null,
        requests: [],
        stats: null,
        pagination: null,
        success: false,
        message: null,
      });
    }

    const hasAccess = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role));

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null,
        requests: [],
        stats: null,
        pagination: null,
        success: false,
        message: null,
      });
    }

    // Récupérer les paramètres de filtrage et pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '10');
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const dateFrom = url.searchParams.get('dateFrom') || undefined;
    const dateTo = url.searchParams.get('dateTo') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const mine = url.searchParams.get('mine') || undefined;
    //

    const api = await createAuthenticatedApi(request);

    // Préparer les paramètres communs pour les deux appels
    const commonParams = {
      status,
      search,
      start_date: dateFrom,
      end_date: dateTo,
      mine: mine === '1' ? '1' : '0',
    };

    // Récupérer les requêtes d'activation ET les statistiques en parallèle
    const [requestsResponse, statsResponse] = await Promise.all([
      api.get('/activation-requests', {
        params: {
          ...commonParams,
          page,
          perPage,
          sortBy,
          sortOrder,
          include: 'ba,customer,processor',
        },
      }),
      api.get('/activation-requests/stats', {
        params: commonParams,
      })
    ]);

    const rawStats = statsResponse.data?.data || statsResponse.data;
    
    const stats = rawStats?.overview ? {
      total: rawStats.overview.total || 0,
      pending: rawStats.overview.pending || 0,
      processing: rawStats.overview.processing || 0,
      activated: rawStats.overview.activated || rawStats.overview.approved || 0,
      rejected: rawStats.overview.rejected || 0,
      cancelled: rawStats.overview.cancelled || 0,
    } : null;

    const paginationData = requestsResponse.data?.data;
    const pagination = paginationData ? {
      currentPage: paginationData.current_page,
      lastPage: paginationData.last_page,
      perPage: paginationData.per_page,
      total: paginationData.total,
      from: paginationData.from,
      to: paginationData.to,
    } : null;

    // Récupérer le message de succès de l'API si présent
    const apiMessage = requestsResponse.data?.message || null;

    return data({
      user,
      hasAccess: true,
      error: null,
      requests: paginationData?.data || [],
      stats: stats,
      pagination: pagination,
      success: requestsResponse.data?.success !== false,
      message: apiMessage,
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);

    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données',
      requests: [],
      stats: null,
      pagination: null,
      success: false,
      message: null,
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const actionType = formData.get('actionType') as string;
  const requestId = formData.get('requestId') as string;

  if (!actionType || !requestId) {
    return data({
      success: false,
      error: 'Paramètres manquants',
      request: null,
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    switch (actionType) {
      case 'accept': {
        const adminNotes = formData.get('adminNotes') as string;
        const response = await api.post(`/activation-requests/${requestId}/accept`, {
          admin_notes: adminNotes || undefined,
        });
        return data({
          success: true,
          request: response.data?.data || response.data,
          error: null,
          message: response.data?.message || 'Demande acceptée avec succès',
        });
      }

      case 'reject': {
        const rejectionReason = formData.get('rejectionReason') as string;
        const adminNotes = formData.get('adminNotes') as string;

        if (!rejectionReason) {
          return data({
            success: false,
            error: 'La raison du rejet est requise',
            request: null,
            message: null,
          }, { status: 400 });
        }

        const response = await api.post(`/activation-requests/${requestId}/reject`, {
          rejection_reason: rejectionReason,
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          request: response.data?.data || response.data,
          error: null,
          message: response.data?.message || 'Demande rejetée avec succès',
        });
      }

      case 'process': {
        const adminNotes = formData.get('adminNotes') as string;
        const response = await api.post(`/activation-requests/${requestId}/process`, {
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          request: response.data?.data || response.data,
          error: null,
          message: response.data?.message || 'Traitement démarré avec succès',
        });
      }

      case 'cancel': {
        const cancelReason = formData.get('cancelReason') as string;
        const response = await api.post(`/activation-requests/${requestId}/cancel`, {
          cancel_reason: cancelReason || undefined,
        });

        return data({
          success: true,
          request: response.data?.data || response.data,
          error: null,
          message: response.data?.message || 'Requête annulée avec succès',
        });
      }

      case 'update': {
        const simNumber = formData.get('sim_number') as string;
        const iccid = formData.get('iccid') as string;
        const imei = formData.get('imei') as string;
        const baNotes = formData.get('baNotes') as string;

        const response = await api.put(`/activation-requests/${requestId}`, {
          sim_number: simNumber,
          iccid: iccid,
          imei: imei || undefined,
          ba_notes: baNotes || undefined,
        });

        return data({
          success: true,
          request: response.data?.data || response.data,
          error: null,
          message: response.data?.message || 'Requête mise à jour avec succès',
        });
      }

      default:
        return data({
          success: false,
          error: 'Action non reconnue',
          request: null,
          message: null,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'action:', error);
    return data({
      success: false,
      error: error?.response?.data?.message || error?.message || 'Une erreur est survenue',
      request: null,
      message: null,
    }, { status: 500 });
  }
}

export default function ActivationRequestsPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigation = useNavigation();

  usePageTitle(t.activationRequests.title);

  const { user, hasAccess, error: loaderError, requests, stats, pagination, message } = loaderData;

  // Déterminer si on est en cours de chargement (filtres, recherche, pagination)
  const isLoading = navigation.state === 'loading';

  // Afficher les toasts pour les messages de l'API
  useEffect(() => {
    if (loaderError) {
      toast.error(loaderError);
    } else if (message) {
      toast.success(message);
    }
  }, [loaderError, message]);

  if (!hasAccess) {
    return (
      <Layout>
        <AccessDenied onBack={() => navigate('/')} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t.activationRequests.title}
              </h1>
              <p className="text-muted-foreground">
                {t.activationRequests.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {stats && <StatsCards stats={stats} />}

        {/* Filtres */}
        <FiltersSection />

        {/* Table des requêtes avec overlay de chargement */}
        <div className="relative">
          {isLoading && <LoadingOverlay message="Recherche en cours..." />}
          <RequestsTable 
            requests={requests}
            pagination={pagination}
            userRole={user?.roles?.[0]}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}

