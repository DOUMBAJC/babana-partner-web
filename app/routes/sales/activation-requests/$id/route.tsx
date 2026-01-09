import { useState, useEffect, useRef } from "react";
import { useNavigate, useActionData, useRevalidator } from "react-router";
import { useTranslation, usePageTitle, useLanguage } from '~/hooks';
import { Layout } from '~/components';
import { Toaster } from '~/components/ui/toaster';
import { toast } from 'sonner';
import type { Route } from "./+types/route";
import { AcceptDialog } from '../components/AcceptDialog';
import { RejectDialog } from '../components/RejectDialog';
import { EditDialog } from '../components/EditDialog';
import { CancelDialog } from '../components/CancelDialog';
import { LoadingView } from './components/LoadingView';
import { NotFoundView } from './components/NotFoundView';
import { RequestHeader } from './components/RequestHeader';
import { CustomerInfoCard } from './components/CustomerInfoCard';
import { SimInfoCard } from './components/SimInfoCard';
import { BaInfoCard } from './components/BaInfoCard';
import { NotesInfoCard } from './components/NotesInfoCard';
import { HistorySection } from './components/HistorySection';
import { loader } from './loaders';
import { action } from './actions';

export { loader, action };

export default function ActivationRequestDetailPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
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
        // Afficher le message d'erreur principal dans le toast
        // Les dialogues affichent déjà les erreurs de validation sur les champs
        toast.error(actionData.error);
        
        // Si on a des erreurs de validation supplémentaires, les afficher aussi
        if ('errors' in actionData && actionData.errors && typeof actionData.errors === 'object') {
          const allErrors: string[] = [];
          Object.values(actionData.errors).forEach((fieldErrors) => {
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => {
                if (typeof err === 'string' && !allErrors.includes(err)) {
                  allErrors.push(err);
                }
              });
            }
          });
          
          // Afficher les erreurs supplémentaires si elles ne sont pas déjà dans le message principal
          if (allErrors.length > 0) {
            allErrors
              .filter((err) => !actionData.error.includes(err))
              .slice(0, 3)
              .forEach((err) => {
                toast.error(err, { duration: 4000 });
              });
          }
        }
      }
    }
  }, [actionData, revalidator]);

  // Rediriger si l'utilisateur n'a pas accès
  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, hasAccess, navigate]);

  if (!isAuthenticated) {
    return <LoadingView />;
  }

  if (!hasAccess) {
    return null;
  }

  if (!request) {
    return <NotFoundView error={loaderError || undefined} />;
  }

  return (
    <Layout>
      <Toaster />
      
      {/* Background gradient animé */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <RequestHeader
          request={request}
          user={user}
          language={language}
          translations={t.activationRequests}
          onAccept={() => setShowAcceptDialog(true)}
          onReject={() => setShowRejectDialog(true)}
          onEdit={() => setShowEditDialog(true)}
          onCancel={() => setShowCancelDialog(true)}
          onBack={() => navigate('/sales/activation-requests')}
        />

        {/* Grille de cartes d'information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CustomerInfoCard request={request} />
          <SimInfoCard request={request} />
          <BaInfoCard request={request} />
          <NotesInfoCard request={request} />
        </div>

        {/* Historique (si disponible) */}
        <HistorySection request={request} language={language} />
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

