
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService, AuthResponse } from '@/services/authService';

interface User {
  id: string;
  email: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<AuthResponse>;
  resendOTP: (email: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<AuthResponse>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<AuthResponse>;
  deleteAccount: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, email, userId, isAuthenticated, setCredentials, logout: logoutAction } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const user = token && email && userId ? { 
    id: userId, 
    email: email,
    isVerified: true 
  } : null;

  useEffect(() => {
    // Auth state is already initialized from Zustand store
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authService.login({ email, password });
    if (response.token && response._id) {
      setCredentials({ 
        token: response.token, 
        email: email,
        userId: response._id 
      });
    }
    return response;
  };

  const register = async (email: string, password: string): Promise<AuthResponse> => {
    return authService.register({ email, password });
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    logoutAction();
  };

  const verifyOTP = async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await authService.verifyOTP({ email, otp });
    if (response.success && user) {
      // Update user verification status if needed
    }
    return response;
  };

  const resendOTP = async (email: string): Promise<AuthResponse> => {
    return authService.resendOTP(email);
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    return authService.forgotPassword({ email });
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<AuthResponse> => {
    return authService.resetPassword({ email, otp, new_password: newPassword });
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    return authService.updatePassword({ current_password: currentPassword, new_password: newPassword });
  };

  const deleteAccount = async (): Promise<AuthResponse> => {
    const response = await authService.deleteAccount();
    if (response.success) {
      logoutAction();
    }
    return response;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
