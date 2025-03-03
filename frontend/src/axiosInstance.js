import frontendData from './config/frontend.json'

import axios from 'axios'
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'api/'
    : 'http://localhost:4000/api/'
})

export default instance