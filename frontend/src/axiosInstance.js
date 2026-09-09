import axios from 'axios'

const apiHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'api/'
    : `http://${apiHost}:4000/api/`
})

export default instance