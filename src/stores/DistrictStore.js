import { defineStore } from 'pinia'; 
import api from '@/api/http';

export const useDistrictStore = defineStore('district', {
  state: () => ({
    districts: [],
    loading: false
  }),
  actions: {
    async fetchDistricts() {
      this.loading = true;
      try {
        const response = await api.get('/districts');
        if (response.data.result) {
          this.districts = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        this.loading = false;
      }
    },
    async addDistrict(name) {
      try {
        const response = await api.post('/districts', { name });
        return response.data.result;
      } catch (error) { return false; }
    },
    async updateDistrict(id, name) {
      try {
        const response = await api.put(`/districts/${id}`, { name });
        return response.data.result;
      } catch (error) { return false; }
    },
    async deleteDistrict(id) {
      try {
        const response = await api.delete(`/districts/${id}`);
        return response.data.result;
      } catch (error) { return false; }
    }
  }
});