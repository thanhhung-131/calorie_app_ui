import axios from 'axios';

const BASE_URL = 'http://34.203.34.254:3000/api';
// const BASE_URL = 'https://369a-1-55-36-216.ngrok-free.app/api'


class fetchData {
  async createFood(token, foodData) {
    try {
      const response = await axios.post(BASE_URL + '/foods', {
        ...foodData
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getHighCalorieFoods() {
    try {
      const response = await axios.get(BASE_URL + '/foods/high-calorie/400');
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getLowCalorieFoods() {
    try {
      const response = await axios.get(BASE_URL + '/foods/low-calorie/300');
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  async getAllFoods() {
    try {
      const response = await axios.get(BASE_URL + '/foods');
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getFoodById(id) {
    try {
      const response = await axios.get(BASE_URL + `/foods/food?id=${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getSalads() {
    try {
      const response = await axios.get(BASE_URL + `/foods/search?name=salad`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async searchFood(query) {
    try {
      const response = await axios.get(BASE_URL + `/foods/search?name=${query}`);
      return response.data;
    } catch (err) {
      return { data: null, error: err.message || 'Network error' };
    }
  }

  async addFoodToFavorites(food_id, token) {
    try {
      const response = await axios.post(BASE_URL + '/favorites', { food_id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async removeFoodFromFavorites(food_id, token) {
    try {
      const response = await axios.delete(BASE_URL + '/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          food_id
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in removeFoodFromFavorites:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async removeFood(token, foodId) {
    try {
      const response = await axios.delete(BASE_URL + `/foods/food/${foodId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in remove Food:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getFavoriteFoods(token) {
    try {
      const response = await axios.get(BASE_URL + '/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async updateFood(token, foodData, foodId) {
    try {
      const response = await axios.put(BASE_URL + `/foods/food/${foodId}`, {
        ...foodData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCalories(token, calorie){
    try {
      const response = await fetch(`${BASE_URL}/calories/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({calorie})
      });
      const data = await response.json();
      return data
    } catch (error) {
      console.error(error);
    }
  }
}

export default new fetchData();
