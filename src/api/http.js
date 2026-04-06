import axios from 'axios'
 
const api = axios.create({
  baseURL: 'https://bontubjoul2.csm.linkpc.net/api',
  headers: {
    Accept: 'application/json',
  },
})
 
// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
 
// If token expires (401), clear storage automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)
 
export default api
 
