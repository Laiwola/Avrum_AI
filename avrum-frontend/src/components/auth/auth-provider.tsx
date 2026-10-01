import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, authService } from "@/lib/auth-service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      authService.setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if logout fails
      setUser(null);
      authService.setCurrentUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) return;

    setIsLoading(true);
    try {
      // In a real app, you'd have a GET /auth/me endpoint
      // For now, we rely on the user data from login/verify
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      authService.setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        await refreshUser();
      }
    };
    void initAuth();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    setUser: (newUser: User | null) => {
      setUser(newUser);
      authService.setCurrentUser(newUser);
    },
    setIsLoading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
