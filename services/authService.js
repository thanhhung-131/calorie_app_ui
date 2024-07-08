import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://34.203.34.254:3000/api';
// const BASE_URL = 'https://369a-1-55-36-216.ngrok-free.app/api'

class AuthService {
  async register(username, email, password) {
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }
      return data;
    } catch (error) {
      console.error('Error registering:', error.message);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        throw new Error(textData || 'Unexpected non-JSON response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
      await this.storeUserData(data);
      return data;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  }

  async getAllUsers(token) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      return data;
    }
    catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  }

  async updateProfile(token, updatedData) {
    try {
      const response = await fetch(`${BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  }

  async storeUserData(newData) {
    try {
      await AsyncStorage.setItem('userToken', JSON.stringify(newData));
    } catch (error) {
      console.error('Error storing user data:', error.message);
    }
  }

  async getToken() {
    try {
      const userData = await AsyncStorage.getItem('userToken');
      return userData ? JSON.parse(userData).token : null;
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error.message);
      throw error;
    }
  }

  async getUserDataByToken(token) {
    try {
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      await AsyncStorage.setItem('userData', JSON.stringify(data))
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  }

  async clearUserData() {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error clearing user data from AsyncStorage:', error.message);
      throw error;
    }
  }

  async createUser(token, userData) {
    console.log(userData)
    try {
      const response = await fetch(`${BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      return data;
    }
    catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  async getUserById(token, id) {
    try {
      const response = await fetch(`${BASE_URL}/users/user/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  }

  async deleteUser(token, id) {
    try {
      const response = await fetch(`${BASE_URL}/users/user/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      return data;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  }
}

export default new AuthService();
