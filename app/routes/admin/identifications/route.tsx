import { useNavigate, data, useNavigation } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import { Layout } from '~/components';
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { StatsCards } from './components/StatsCards';
import { FiltersSection } from './components/FiltersSection';
import { IdentificationsTable } from './components/IdentificationsTable';
import { AccessDenied } from './components/AccessDenied';
import type { RoleSlug } from '~/types';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { LoadingOverlay } from '~/components/ui/loading-overlay';

const AUTHORIZED_ROLES: RoleSlug[] = ['super_admin', 'admin', 'activateur', 'identificateur'];

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

    const hasAccess = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role as RoleSlug));

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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '10');
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const dateFrom = url.searchParams.get('dateFrom') || undefined;
    const dateTo = url.searchParams.get('dateTo') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'submitted_at';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const api = await createAuthenticatedApi(request);

    const commonParams = {
      status,
      search,
      start_date: dateFrom,
      end_date: dateTo,
    };

    const [requestsResponse] = await Promise.all([
      api.get('/identifications', {
        params: {
          ...commonParams,
          page,
          perPage,
          sortBy,
          sortOrder,
          include: 'ba,customer,processor',
        },
      })
    ]);

    const paginationData = requestsResponse.data?.data;
    const pagination = paginationData ? {
      currentPage: paginationData.current_page,
      lastPage: paginationData.last_page,
      perPage: paginationData.per_page,
      total: paginationData.total,
      from: paginationData.from,
      to: paginationData.to,
    } : null;

    // Calculer des stats simples à partir de la réponse si le backend n'a pas d'endpoint stats dédié
    // (Pour l'instant on va utiliser les données paginées ou faire une requête séparée si nécessaire)
    const stats = {
      total: paginationData?.total || 0,
      pending: paginationData?.data?.filter((r: any) => r.status === 'pending').length || 0, // Idéalement le backend donnerait ça
      approved: paginationData?.data?.filter((r: any) => r.status === 'approved').length || 0,
      rejected: paginationData?.data?.filter((r: any) => r.status === 'rejected').length || 0,
    };

    return data({
      user,
      hasAccess: true,
      error: null,
      requests: paginationData?.data || [],
      stats: stats,
      pagination: pagination,
      success: requestsResponse.data?.success !== false,
      message: requestsResponse.data?.message || null,
    });
  } catch (error: any) {
    console.error('Erreur dans le loader identifications:', error?.message);
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
    return data({ success: false, error: 'Paramètres manquants' }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    switch (actionType) {
      case 'approve': {
        const adminNotes = formData.get('adminNotes') as string;
        const response = await api.post(`/identifications/${requestId}/approve`, {
          admin_notes: adminNotes || undefined,
        });
        return data({
          success: true,
          message: t.identifications.messages.approved,
        });
      }

      case 'reject': {
        const reason = formData.get('reason') as string;
        const adminNotes = formData.get('adminNotes') as string;

        if (!reason) {
          return data({ success: false, error: t.forms.required }, { status: 400 });
        }

        const response = await api.post(`/identifications/${requestId}/reject`, {
          rejection_reason: reason,
          admin_notes: adminNotes || undefined,
        });

        return data({
          success: true,
          message: t.identifications.messages.rejected,
        });
      }

      default:
        return data({ success: false, error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error: any) {
    return data({
      success: false,
      error: error?.response?.data?.message || error?.message || 'Une erreur est survenue',
    }, { status: 500 });
  }
}

export default function IdentificationsPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigation = useNavigation();

  usePageTitle(t.identifications.title);

  const { user, hasAccess, error, requests, stats, pagination, message } = loaderData;
  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (error) toast.error(error);
    else if (message) toast.success(message);
  }, [error, message]);

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t.identifications.title}
          </h1>
          <p className="text-muted-foreground">
            {t.identifications.description}
          </p>
        </div>

        {stats && <StatsCards stats={stats} />}
        <FiltersSection />

        <div className="relative">
          {isLoading && <LoadingOverlay message="Chargement..." />}
          <IdentificationsTable 
            requests={requests}
            pagination={pagination}
            userRole={user?.roles?.[0]}
          />
        </div>
      </div>
    </Layout>
  );
}
