// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/User';


interface UserToken {
  data: User;
  exp: number;
  iat: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    try {
      return jwtDecode<UserToken>(this.getToken() || '');
    } catch (error) {
      return null;
    }
  }

  getRole() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded = jwtDecode<UserToken>(token);
    return decoded.data.role;
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token)  
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
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Dispatch a custom event to notify the auth hook
    window.location.assign('/');
  }
}

export default new AuthService();
