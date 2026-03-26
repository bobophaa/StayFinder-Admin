import { defineStore } from 'pinia'
import api from '@/api/http'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [],
    myRooms: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRooms() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/rooms?page=1&per_page=20&sort_col=id&sort_dir=desc')
        this.rooms = response.data.data
        this.myRooms = res.data.data || []
      } catch (err) {
        this.error = 'Erro'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async fetchRoomById(id) {
      this.loading = true
      this.error = null
      this.room = null
      try {
        const res = await api.get(`/rooms/${id}`)

        this.room = res.data.data
      } catch (err) {
        this.error = 'Could not find room details.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async addRoom(formData) {
      this.loading = true
      try {
        const res = await api.post('/rooms', formData)
        if (res.data.result === true) {
          return true
        }

        console.error('API Error Details:', res.data)
        return false
      } catch (err) {
        console.error('Submission failed:', err.response?.data)
        return false
      } finally {
        this.loading = false
      }
    },
    async fetchMyRooms() {
      this.loading = true
      try {
        const res = await api.get('api/provider/rooms')
        this.myRooms = res.data.data
      } catch (error) {
        console.error('Failed to fetch your rooms', error)
      } finally {
        this.loading = false
      }
    },
  },
})
