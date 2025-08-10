import axios from 'axios'

const api = axios.create({
  baseURL: 'https://spa-proxy.onrender.com/api', 
})

export default api
