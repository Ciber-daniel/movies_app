import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

api.interceptors.request.use(function (config) {
  config.params = { ...config.params, api_key: import.meta.env.VITE_API_KEY }
  return config
})

export default api
