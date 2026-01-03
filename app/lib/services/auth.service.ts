import { api, type ApiError } from './axios';
import type { User, LoginCredentials, RegisterFormData, UserSession } from '~/types';
import { getClientMetadata } from '~/lib/client/client-metadata';
import { getCachedGeolocation } from '~/lib/geo/geolocation';

/**
 * Réponse de l'API pour les sessions
 */
export interface SessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: UserSession[];
    total: number;
    max_allowed: number;
  };
}

/**
 * Réponse de l'API pour la connexion
 */
export interface LoginResponse {
  data: {
    user: User;
    token: string;
    expiresIn?: number;
  };
}

/**
 * Réponse de l'API pour l'enregistrement
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    requires_email_verification: boolean;
  };
}

/**
 * Réponse de l'API pour la demande de réinitialisation de mot de passe
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  error: string;
}

/**
 * Réponse de l'API pour la réinitialisation de mot de passe
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  error: string;
  data: {
    user: User;
    token: string;
    expiresIn?: number;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Récupérer les métadonnées du client
      const metadata = getClientMetadata();
      const geolocation = getCachedGeolocation();

      // Préparer les données de connexion avec les métadonnées
      const loginData = {
        email: credentials.email,
        password: credentials.password,
        
        // Métadonnées du client (optionnelles mais recommandées)
        device_name: `${metadata.os} (${metadata.browser})`,
        client_os: metadata.os,
        client_browser: metadata.browser,
        client_browser_version: metadata.browserVersion,
        client_platform: metadata.platform,
        screen_resolution: metadata.screenResolution,
        timezone: metadata.timezone,
        client_language: metadata.language,
        
        // Géolocalisation (optionnelle, nécessite consentement)
        ...(geolocation && {
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
          location_accuracy: geolocation.accuracy,
        }),
      };

      // Log de débogage en développement
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.log('🔍 Login payload:', loginData);
      }

      const response = await api.post<LoginResponse>('/auth/login', loginData);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Enregistrement d'un nouvel utilisateur
   */
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Déconnexion d'un utilisateur
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  me: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/user');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Mettre à jour le profil de l'utilisateur
   * Utilise la route API proxy Remix pour l'authentification
   */
  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    personal_phone?: string;
  }): Promise<User> => {
    try {
      const response = await api.put<{ success: boolean; data?: { user: User }; user?: User; error?: string }>('/api/auth/profile', data, {
        baseURL: "",
      });
      
      // Vérifier si la requête a échoué
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la mise à jour du profil");
      }
      
      // Gérer les différentes structures de réponse
      if (response.data?.user) {
        return response.data.user;
      }
      if (response.user) {
        return response.user;
      }
      throw new Error("Format de réponse inattendu");
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Changer le mot de passe
   * Utilise la route API proxy Remix pour l'authentification
   */
  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> => {
    try {
      const response = await api.post<{ success: boolean; error?: string }>('/api/auth/change-password', data, {
        baseURL: "",
      });
      
      // Vérifier si la requête a échoué
      if (!response.success) {
        throw new Error(response.error || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rafraîchir le token d'authentification
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh', {
        refreshToken,
      });
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Demander un lien de réinitialisation de mot de passe
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword: async (
    token: string,
    password: string,
    password_confirmation: string,
    email: string | null,
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await api.post<ResetPasswordResponse>('/auth/reset', {
        token,
        password,
        password_confirmation,
        email,
      });
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Vérifier l'adresse email
   */
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Renvoyer l'email de vérification
   */
  resendVerificationEmail: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/resend-verification', { email });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Sessions
   * Utilise les routes Remix (SSR) pour assurer l'authentification correcte
   */
  getSessions: async (): Promise<UserSession[]> => {
    try {
      const response = await api.get<SessionsResponse>('/api/sessions', {
        // On vise la route Remix (same-origin) plutôt que le backend direct
        baseURL: "",
      });
      return response.data.sessions;
    } catch (error) {
      throw error as ApiError;
    }
  },

  revokeSession: async (tokenId: string): Promise<void> => {
    try {
      await api.delete(`/api/sessions/${tokenId}`, {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  revokeOtherSessions: async (): Promise<void> => {
    try {
      await api.delete('/api/sessions/other/revoke', {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  updateActivity: async (): Promise<void> => {
    try {
      await api.post('/api/sessions/activity', undefined, {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },
};
