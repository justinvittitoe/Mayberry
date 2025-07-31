import { useState, useEffect } from 'react';
import AuthService from '../utils/auth';
import { User } from '../models/User';


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = AuthService.loggedIn();
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const profile = AuthService.getProfile();
          console.log(profile, 'auth')
          setUser(profile?.data || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isUser = (): boolean => {
    return hasRole('user');
  };

  return {
    isAuthenticated,
    user,
    loading,
    hasRole,
    isAdmin,
    isUser
  };
};