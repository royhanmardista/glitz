const axios = require('axios')

const instance = axios.create({
    baseURL : 'https://jobs.github.com/positions.json'
})

module.exports = instance