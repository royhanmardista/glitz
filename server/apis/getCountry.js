const axios = require('axios')

const instance = axios.create({
    baseURL : `http://battuta.medunes.net/api/country/all`
})

module.exports = instance