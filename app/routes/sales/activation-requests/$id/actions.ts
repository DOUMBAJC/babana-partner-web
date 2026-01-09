import { data } from "react-router";
import { createAuthenticatedApi } from '~/services/api.server';
import type { Route } from "./+types/route";

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
    console.error('Erreur lors de l\'action:', error);
    
    const errorResponse = error?.response;
    const errorData = errorResponse?.data;
    const status = errorResponse?.status || 500;

    // Extraire tous les messages d'erreur
    let errorMessage = '';
    const errors: Record<string, string[]> = {};

    // 1. Erreurs de validation (format Laravel: { errors: { field: [messages] } })
    if (errorData?.errors && typeof errorData.errors === 'object') {
      Object.keys(errorData.errors).forEach((field) => {
        const fieldErrors = errorData.errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
    }

    // 2. Message d'erreur principal
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Si on n'a pas de message mais qu'on a des erreurs de validation, utiliser le premier
    if (!errorMessage && Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      errorMessage = errors[firstField][0];
    }

    // Message par défaut si rien n'est trouvé
    if (!errorMessage) {
      errorMessage = 'Une erreur est survenue';
    }

    return data({
      success: false,
      error: errorMessage,
      errors,
    }, { status });
  }
}

