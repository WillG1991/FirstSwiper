import AsyncStorage from '@react-native-async-storage/async-storage';
import decode from 'jwt-decode';

class AuthService {
  async getProfile() {
    const token = await this.getToken();
    return decode(token);
  }

  async loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = await this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  async getToken() {
    // Retrieves the user token from AsyncStorage
    try {
      const token = await AsyncStorage.getItem('id_token');
      return token;
    } catch (error) {
      return null;
    }
  }

  async login(idToken) {
    // Saves user token to AsyncStorage
    try {
      await AsyncStorage.setItem('id_token', idToken);
      // You can navigate to another screen in your app here
      // For example, you can use React Navigation:
      // navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  async logout() {
    // Clear user token and profile data from AsyncStorage
    try {
      await AsyncStorage.removeItem('id_token');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('visited');
      // You can navigate to the login or home screen after logout
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}

export default new AuthService();
