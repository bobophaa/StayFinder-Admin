import api from '@/api/http'; 
import { defineStore } from 'pinia';
export const useRoomOptionStore = defineStore('roomOption', {
  state: () => ({
    options: [],
    loading: false
  }),
  actions: {
    async fetchOptions() {
      this.loading = true;
      try {
      
        const response = await api.get('/room-options');
        if (response.data.result) {
          this.options = response.data.data;
        }
      } catch (error) {
        console.error("មានកំហុសក្នុងការទាញយកព័ត៌មានបន្ទប់", error);
      } finally {
        this.loading = false;
      }
    }
  }
});