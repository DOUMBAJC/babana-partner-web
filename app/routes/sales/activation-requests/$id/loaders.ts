import { data } from "react-router";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { AUTHORIZED_ROLES } from "./constants";
import type { Route } from "./+types/route";

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

    // Récupérer la requête d'abord pour vérifier si l'utilisateur est le propriétaire
    const api = await createAuthenticatedApi(request);
    let activationRequest;
    
    try {
      const response = await api.get(`/activation-requests/${id}`, {
        params: {
          include: 'ba,customer,processor,history',
        },
      });
      activationRequest = response.data?.data || response.data;
    } catch (error: any) {
      // Si l'erreur est 404 ou accès refusé, on retourne un accès refusé
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return data({
          user,
          hasAccess: false,
          error: 'Requête non trouvée ou accès refusé',
          request: null,
          statusChanged: false,
        });
      }
      throw error;
    }

    // Vérifier si l'utilisateur est le propriétaire de la requête
    const isOwner = activationRequest.baId === user.id;
    
    // Vérifier si l'utilisateur a un rôle autorisé
    const hasAuthorizedRole = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role));
    
    const isActivator = user.roles?.some((role) => 
      ['activateur', 'admin', 'super_admin'].includes(role)
    );
    
    // Règles d'accès :
    // - Les activateurs peuvent voir toutes les requêtes
    // - Le propriétaire de la requête peut voir sa propre requête (même sans rôle autorisé)
    // - Les autres utilisateurs avec rôles autorisés peuvent voir les requêtes
    if (!isOwner && !hasAuthorizedRole) {
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

