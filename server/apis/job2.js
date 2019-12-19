const axios = require('axios')

const instance = axios.create({
    baseURL : 'https://www.themuse.com/api/public/jobs',    
})

module.exports = instance