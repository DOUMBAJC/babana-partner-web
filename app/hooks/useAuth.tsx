import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useSubmit } from 'react-router';
import type { AuthState, User } from '~/types/auth.types';

interface AuthContextType extends AuthState {
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  initialUser 
}: { 
  children: ReactNode;
  initialUser: User | null;
}) {
  const submit = useSubmit();
  
  // State is derived from initialUser prop (which comes from loader)
  // We can use state to allow optimistic updates, but primarily it syncs with loader data.
  const [state, setState] = useState<AuthState>({
    user: initialUser,
    token: null, // Token is HTTP Only, not accessible to JS.
    isAuthenticated: !!initialUser,
    isLoading: false,
  });

  // Sync state with prop if it changes (revalidation)
  useEffect(() => {
    setState({
        user: initialUser,
        token: null,
        isAuthenticated: !!initialUser,
        isLoading: false,
    });
  }, [initialUser]);

  // Écouter les événements d'erreur 401 pour déconnecter automatiquement
  useEffect(() => {
    const handleUnauthorized = () => {
      // Déconnecter l'utilisateur proprement via React Router
      submit(null, { method: "post", action: "/logout" });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [submit]);

  const logout = () => {
    submit(null, { method: "post", action: "/logout" });
  };

  const updateUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
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
