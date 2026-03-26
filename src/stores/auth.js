import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/login', { email, password });
        const userData = response.data.user;

     
        if (userData.role !== 'provider') {
           throw new Error('Access Denied: You are not a Provider.');
        }

        if (userData.status !== 'active') { 
           throw new Error('Your account is pending Admin approval.');
        }

        
        this.user = userData;
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || error.message 
        };
      }
    }
  }
})