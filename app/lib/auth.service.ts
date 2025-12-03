import { api, type ApiError } from './axios';
import type { User, LoginCredentials, RegisterData } from '~/types';

/**
 * Réponse de l'API pour la connexion
 */
export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: number;
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
 * Service d'authentification
 * Gère les appels API pour l'authentification
 */
export const authService = {
  /**
   * Connexion d'un utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Enregistrement d'un nouvel utilisateur
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
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
      const response = await api.get<User>('/auth/me');
      return response;
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
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
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
    passwordConfirmation: string
  ): Promise<void> => {
    try {
      await api.post('/auth/reset-password', {
        token,
        password,
        passwordConfirmation,
      });
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
};

/**
 * Exemple d'utilisation dans un composant :
 *
 * ```tsx
 * import { authService } from '~/lib/auth.service';
 * import { useAuth } from '~/hooks';
 *
 * function LoginForm() {
 *   const { updateUser } = useAuth();
 *
 *   const handleLogin = async (credentials: LoginCredentials) => {
 *     try {
 *       const { user, token } = await authService.login(credentials);
 *       
 *       // Sauvegarder le token et l'utilisateur
 *       localStorage.setItem('babana_auth_token', token);
 *       localStorage.setItem('babana_auth_user', JSON.stringify(user));
 *       
 *       // Mettre à jour le contexte
 *       updateUser(user);
 *       
 *       // Rediriger vers le dashboard
 *       navigate('/dashboard');
 *     } catch (error) {
 *       console.error('Login failed:', error);
 *       setError(error.message);
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit(handleLogin)}>...</form>;
 * }
 * ```
 */


