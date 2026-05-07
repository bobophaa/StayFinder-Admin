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
           throw new Error('មិនអនុញ្ញាតឱ្យចូលប្រើប្រាស់៖ អ្នកមិនមែនជាម្ចាស់ផ្ទះជួលទេ។');
        }

        if (userData.status !== 'active') { 
           throw new Error('គណនីរបស់អ្នកកំពុងរង់ចាំការអនុម័តដោយអ្នកគ្រប់គ្រង។ សូមរង់ចាំឬទំនាក់ទំនងអ្នកគ្រប់គ្រងសម្រាប់ព័ត៌មានបន្ថែម។');
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