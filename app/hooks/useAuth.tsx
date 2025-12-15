import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useSubmit } from 'react-router';
import type { AuthState, User, LoginCredentials } from '~/types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
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

  const login = async (credentials: LoginCredentials) => {
    // Client-side login is deprecated in favor of Form actions.
    // If called, we redirect to login page.
    window.location.href = "/auth/login";
  };

  const logout = () => {
    submit(null, { method: "post", action: "/auth/logout" });
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
