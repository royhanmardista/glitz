const axios = require('axios')

const instance = axios.create({
    baseURL : 'http://universities.hipolabs.com/',    
})

module.exports = instance