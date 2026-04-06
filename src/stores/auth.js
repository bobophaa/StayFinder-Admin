import { defineStore } from 'pinia'
import api from '@/api/http'
import router from '@/router'

function safeParse(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: safeParse(localStorage.getItem('user')),
    token: localStorage.getItem('token') || null,

    emailOrPhone: '',
    password: '',

    loading: false,
    error: '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,

    isAdmin: (state) => state.user?.roles?.some((r) => r.name === 'System Admin'),

    isProvider: (state) => state.user?.roles?.some((r) => r.name === 'Service Provider'),
  },
  actions: {
  async login() {
  if (!this.emailOrPhone || !this.password) {
    this.error = 'Please enter your email and password.'
    return { success: false }
  }

  this.loading = true
  this.error = ''

  try {
    const res = await api.post('/login', {
      email: this.emailOrPhone,
      password: this.password,
    })

    const data = res.data.data || res.data
    const token = data.token || data.access_token
    const user = data

    if (!token) {
      this.error = 'Token not found.'
      return { success: false }
    }

    const role = user?.roles?.[0]?.name

    if (role !== 'System Admin' && role !== 'Service Provider') {
      this.error = 'Access denied.'
      return { success: false }
    }

    this.token = token
    this.user = user

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return {
      success: true,
      role: role,
    }

  } catch (err) {
    this.error = err.response?.data?.message || 'Login failed.'
    return { success: false }
  } finally {
    this.loading = false
  }
}
,

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      router.push('/login')
    },

    checkAuth() {
      try {
        const user = localStorage.getItem('user')
        this.user = user ? JSON.parse(user) : null
        this.token = localStorage.getItem('token')
      } catch (e) {
        console.error('Invalid JSON in localStorage. Clearing user data.')
        localStorage.removeItem('user')
        this.user = null
      }
    },
  },
})
