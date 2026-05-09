import { defineStore } from 'pinia'
import api from '@/api/http'

const safeParse = (key) => {
  try {
    const val = localStorage.getItem(key)
    if (!val || val === 'undefined' || val === 'null') return null
    return JSON.parse(val)
  } catch {
    return null
  }
}

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [],
    myRooms: [],
    room: null,
    loading: false,
    error: '',
  }),

  actions: {
    async fetchRooms(query = 'page=1&per_page=100&sort_col=id&sort_dir=desc') {
      this.loading = true
      this.error = ''
      try {
        const res = await api.get(`/rooms?${query}`)
        this.rooms = res.data?.data?.data || res.data?.data || res.data || []
      } catch (err) {
        this.error = err.response?.data?.message || 'ផ្ទុកបន្ទប់បរាជ័យ។'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchMyRooms(overrideUserId = null) {
      this.loading = true
      this.error = ''
      try {
        const user = overrideUserId ? { id: overrideUserId } : safeParse('user')
        const providerId = user?.id

        if (!providerId) {
          this.error = 'មិនអាចរកលេខសម្គាល់អ្នកប្រើបានទេ។ សូមចូលគណនីម្តងទៀត។'
          return
        }

        const res = await api.get('/rooms', {
          params: { page: 1, per_page: 500, sort_col: 'id', sort_dir: 'desc' },
        })

        const allRooms = res.data?.data?.data || res.data?.data || res.data || []
        this.rooms = allRooms

        this.myRooms = allRooms.filter((room) => {
          const candidates = [
            room.creator?.id,
            room.user_id,
            room.user?.id,
            room.owner_id,
            room.owner?.id,
          ]
          return candidates.some((id) => id != null && String(id) === String(providerId))
        })

        console.log(
          '[fetchMyRooms] providerId:', providerId,
          '| total:', allRooms.length,
          '| mine:', this.myRooms.length,
        )

        if (allRooms.length > 0) {
          const sample = allRooms[0]
          console.log(
            '[fetchMyRooms] sample room owner fields →',
            'creator.id:', sample.creator?.id,
            'user_id:', sample.user_id,
            'user.id:', sample.user?.id,
            'owner_id:', sample.owner_id,
          )
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'ផ្ទុកបន្ទប់របស់អ្នកបរាជ័យ។'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchRoomById(id) {
      this.loading = true
      this.error = ''
      this.room = null
      try {
        const res = await api.get(`/rooms/${id}`)
        this.room = res.data?.data || res.data
      } catch (err) {
        this.error = 'មិនអាចរកព័ត៌មានបន្ទប់បានទេ។'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    // FIX: renamed addRoom → createRoom to match AddRoom.vue call
    async createRoom(formData) {
      this.loading = true
      try {
        const res = await api.post('/rooms', formData)
        if (res.data?.result === true) {
          const newRoom = res.data.data
          if (newRoom) {
            this.rooms.unshift(newRoom)
            this.myRooms.unshift(newRoom)
          }
          return true
        }
        console.error('API returned false result:', res.data)
        return false
      } catch (err) {
        console.error('Create room failed:', err.response?.data)
        return false
      } finally {
        this.loading = false
      }
    },

    // FIX: _method=POST → _method=PUT (Laravel needs PUT for update, POST spoofing did nothing)
    // FIX: added null guard before assigning updated room to avoid overwriting with undefined
    async updateRoom(id, formData) {
      this.loading = true
      try {
        const res = await api.post(`/rooms/${id}?_method=PUT`, formData)
        if (res.data) {
          const updated = res.data?.data
          if (updated) {
            const idx = this.rooms.findIndex((r) => r.id === id)
            if (idx !== -1) this.rooms[idx] = updated

            const myIdx = this.myRooms.findIndex((r) => r.id === id)
            if (myIdx !== -1) this.myRooms[myIdx] = updated
          }
          return true
        }
        return false
      } catch (err) {
        console.error('Update room failed:', err.response?.data)
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteRoom(roomId) {
      try {
        await api.delete(`/rooms/${roomId}`)
        this.rooms = this.rooms.filter((r) => r.id !== roomId)
        this.myRooms = this.myRooms.filter((r) => r.id !== roomId)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'លុបបន្ទប់បរាជ័យ។'
        console.error(err)
        return false
      }
    },
  },
})