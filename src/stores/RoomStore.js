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
        this.error = 'មានបញ្ហាក្នុងការទាញយកព័ត៌មានបន្ទប់។ សូមព្យាយាមម្តងទៀត។'
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
        this.error = 'មិនអាចទាញយកព័ត៌មានបន្ទប់បាន។ សូមព្យាយាមម្តងទៀត។'
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

        console.error('ព័ត៌មានលម្អិតអំពីកំហុស API', res.data)
        return false
      } catch (err) {
        console.error('មានបញ្ហាក្នុងការបញ្ជូនទិន្នន័យ', err.response?.data)
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
        console.error('មានបញ្ហាក្នុងការទាញយកបន្ទប់របស់អ្នក', error)
      } finally {
        this.loading = false
      }
    },
  },
})
