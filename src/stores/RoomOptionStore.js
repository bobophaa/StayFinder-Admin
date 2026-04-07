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
        console.error("Error fetching room options:", error);
      } finally {
        this.loading = false;
      }
    },
    // Add New Option
    async addOption(name) {
      try {
        const response = await api.post('/room-options', { name });
        return response.data.result;
      } catch (error) {
        return false;
      }
    },
    // Update Option
    async updateOption(id, name) {
      try {
        const response = await api.put(`/room-options/${id}`, { name });
        return response.data.result;
      } catch (error) {
        return false;
      }
    },
    // Delete Option
    async deleteOption(id) {
      try {
        const response = await api.delete(`/room-options/${id}`);
        return response.data.result;
      } catch (error) {
        return false;
      }
    }
  }
});