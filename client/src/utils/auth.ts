// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';


interface UserToken {
  name: string;
  email: string;
  role: string;
  _id: string;
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
