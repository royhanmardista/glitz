`use strict`
const {
    Schema,
    model
} = require('mongoose')

const countrySchema = new Schema({
    name: {
        type: String,
        required: [true, 'you must fill the name'],
        lowercase: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'you must fill the name'],
    }
}, {})

const Country = model('Country', countrySchema)
module.exports = Country