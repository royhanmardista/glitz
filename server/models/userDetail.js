`use strict`

const {
    Schema,
    model
} = require('mongoose')

const userDetailSchema = Schema({
    phone : {
        type : String,
        required: [true, 'you must input your phone number'],
    },
    skills: {
        type: Array,
        required: [true, 'you must input your skills'],
    },
    experience: {
        type: Number,
        required: [true, 'you must input your experience']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true,
    runSettersOnQuery: true
})

const userDetail = model('User', userDetailSchema)
module.exports = userDetail