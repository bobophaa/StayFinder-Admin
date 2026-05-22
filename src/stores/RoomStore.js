

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
        const user = overrideUserId
          ? { id: overrideUserId }
          : safeParse('user')

        const providerId = user?.id

        if (!providerId) {
          this.error = 'មិនអាចរកលេខសម្គាល់អ្នកប្រើបានទេ។'
          return
        }

        const res = await api.get('/rooms', {
          params: {
            page: 1,
            per_page: 500,
            sort_col: 'id',
            sort_dir: 'desc',
          },
        })

        const allRooms =
          res.data?.data?.data ||
          res.data?.data ||
          res.data ||
          []

        console.log('ALL ROOMS count:', allRooms.length)
        console.log('CURRENT USER ID:', providerId)
        if (allRooms.length > 0) {
          console.log('Sample room keys:', Object.keys(allRooms[0]))
          console.log('Sample room creator fields:', {
            creator: allRooms[0].creator,
            user_id: allRooms[0].user_id,
            user: allRooms[0].user,
            owner_id: allRooms[0].owner_id,
            owner: allRooms[0].owner,
            provider_id: allRooms[0].provider_id,
            provider: allRooms[0].provider,
            created_by: allRooms[0].created_by,
            added_by: allRooms[0].added_by,
          })
        }

        this.rooms = allRooms

        this.myRooms = allRooms.filter((room) => {
          const candidates = [
            room.creator?.id,
            room.user_id,
            room.user?.id,
            room.owner_id,
            room.owner?.id,
            room.provider_id,
            room.provider?.id,
            room.created_by,
            room.added_by,
          ]

          return candidates.some(
            (id) =>
              id != null &&
              String(id) === String(providerId)
          )
        })

        console.log('MY ROOMS count:', this.myRooms.length)

      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'ផ្ទុកបន្ទប់របស់អ្នកបរាជ័យ។'

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

    // ==========================
    // FULL FIXED CREATE ROOM
    // ==========================
    async createRoom(formData) {
      this.loading = true

      try {
        const res = await api.post('/rooms', formData)

        console.log('CREATE ROOM RESPONSE:', res.data)

        // Accept result:true OR HTTP 200/201 with no explicit result field
        const isSuccess =
          res.data?.result === true ||
          (res.data?.result === undefined && (res.status === 200 || res.status === 201))

        if (isSuccess) {
          const newRoom = res.data?.data
          if (newRoom) {
            this.rooms.unshift(newRoom)
          }
          // refresh from backend
          await this.fetchMyRooms()
          return true
        }

        console.error('API returned failure:', res.data)
        this.error = res.data?.message || 'បង្កើតបន្ទប់បរាជ័យ។'
        return false

      } catch (err) {
        const errData = err.response?.data
        console.error('Create room failed — status:', err.response?.status)
        console.error('Create room failed — body:', JSON.stringify(errData, null, 2))
        this.error = errData?.message || 'បង្កើតបន្ទប់បរាជ័យ។'
        return false

      } finally {
        this.loading = false
      }
    },

    async updateRoom(id, formData) {
      this.loading = true

      try {
        const res = await api.post(
          `/rooms/${id}?_method=PUT`,
          formData
        )

        if (res.data) {
          const updated = res.data?.data

          if (updated) {
            const idx = this.rooms.findIndex(
              (r) => r.id === id
            )

            if (idx !== -1)
              this.rooms[idx] = updated

            const myIdx = this.myRooms.findIndex(
              (r) => r.id === id
            )

            if (myIdx !== -1)
              this.myRooms[myIdx] = updated
          }

          return true
        }

        return false

      } catch (err) {
        console.error(
          'Update room failed:',
          err.response?.data
        )

        return false

      } finally {
        this.loading = false
      }
    },

    async deleteRoom(roomId) {
      try {
        await api.delete(`/rooms/${roomId}`)

        this.rooms = this.rooms.filter(
          (r) => r.id !== roomId
        )

        this.myRooms = this.myRooms.filter(
          (r) => r.id !== roomId
        )

        return true

      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'លុបបន្ទប់បរាជ័យ។'

        console.error(err)

        return false
      }
    },
  },
})
