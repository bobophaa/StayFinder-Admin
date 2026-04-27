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
        this.error = err.response?.data?.message || 'Failed to load rooms.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchMyRooms(overrideUserId = null) {
      this.loading = true
      this.error = ''
      try {
        // Prefer the passed-in userId, then fall back to localStorage
        const user = overrideUserId ? { id: overrideUserId } : safeParse('user')
        const providerId = user?.id

        if (!providerId) {
          this.error = 'Could not find your user ID. Please log in again.'
          return
        }

        const res = await api.get('/rooms', {
          params: { page: 1, per_page: 500, sort_col: 'id', sort_dir: 'desc' },
        })

        const allRooms = res.data?.data?.data || res.data?.data || res.data || []
        this.rooms = allRooms

        // Try every field the API might use to link a room to its owner
        this.myRooms = allRooms.filter((room) => {
          const candidates = [
            room.creator?.id,
            room.user_id,
            room.user?.id,
            room.owner_id,
            room.owner?.id,
          ]
          const match = candidates.some(id => id != null && String(id) === String(providerId))
          return match
        })

        console.log('[fetchMyRooms] providerId:', providerId,
          '| total:', allRooms.length,
          '| mine:', this.myRooms.length)

        if (allRooms.length > 0) {
          const sample = allRooms[0]
          console.log('[fetchMyRooms] sample room owner fields →',
            'creator.id:', sample.creator?.id,
            'user_id:', sample.user_id,
            'user.id:', sample.user?.id,
            'owner_id:', sample.owner_id)
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load your rooms.'
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
        console.error('Add room failed:', err.response?.data)
        return false
      } finally {
        this.loading = false
      }
    },

    //Delete room 
    async deleteRoom(roomId) {
      try {
        await api.delete(`/rooms/${roomId}`)
        this.rooms = this.rooms.filter((r) => r.id !== roomId)
        this.myRooms = this.myRooms.filter((r) => r.id !== roomId)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete room.'
        console.error(err)
        return false
      }
    },

async updateRoom(id, formData) {
  this.loading = true
  try {
    const res = await api.post(`/rooms/${id}?_method=POST`, formData)
    if (res.data) {
      const updated = res.data.data
      const idx = this.rooms.findIndex((r) => r.id === id)
      if (idx !== -1) this.rooms[idx] = updated
      const myIdx = this.myRooms.findIndex((r) => r.id === id)
      if (myIdx !== -1) this.myRooms[myIdx] = updated
      return true
    }
    return false
  } catch (err) {
    console.error('Update failed:', err.response?.data)
    return false
  } finally {
    this.loading = false
  }
}


  },
})
