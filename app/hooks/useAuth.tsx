import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { AuthState, User, LoginCredentials } from '~/types/auth.types';
import { api } from '~/lib/axios';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'babana_auth_token';
const AUTH_USER_KEY = 'babana_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Charger l'utilisateur et le token depuis le localStorage au montage
  useEffect(() => {
    const loadAuth = () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userStr = localStorage.getItem(AUTH_USER_KEY);

        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;

      // Sauvegarder dans le localStorage
      // localStorage.setItem(AUTH_TOKEN_KEY, token);
      // localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

      setState({
        user: user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Supprimer du localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

