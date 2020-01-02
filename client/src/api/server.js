import axios from 'axios'

const server = axios.create({
  baseURL: 'http://35.197.157.0/'
})

export default server
