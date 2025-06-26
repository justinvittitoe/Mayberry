// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    try {
      return jwtDecode(this.getToken() || '');
    } catch (error) {
      return null;
    }
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return true; // If we can't decode the token, consider it expired
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    // Dispatch a custom event to notify the auth hook
    window.dispatchEvent(new CustomEvent('authChange'));
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Dispatch a custom event to notify the auth hook
    window.dispatchEvent(new CustomEvent('authChange'));
  }
}

export default new AuthService();

// React hook for authentication state
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = AuthService.getToken();
        if (token && !AuthService.isTokenExpired(token)) {
          const userProfile = AuthService.getProfile();
          setIsAuthenticated(true);
          setUser(userProfile);
        } else {
          // Clear invalid token
          if (token) {
            localStorage.removeItem('id_token');
          }
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        // Clear any invalid token
        localStorage.removeItem('id_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isAuthenticated,
    loading,
    user,
    login: AuthService.login,
    logout: AuthService.logout,
    getProfile: AuthService.getProfile
  };
};
