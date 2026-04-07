import { defineStore } from 'pinia';
import api from '@/api/http';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalUsers: 0,
      totalRooms: 0,
      activeBookings: 0,
      totalRevenue: 0
    },
    recentActivity: [],
    loading: false
  }),
  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        const response = await api.get('/admin/dashboard-stats'); 
        if (response.data.result) {
          this.stats = response.data.data;
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});