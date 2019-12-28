`use strict`
const moment = require('moment')
const {
    Schema,
    model
} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const userDetailSchema = Schema({
    fullname: {
        type: String,
        required: [true, "you must input your fullname"],
        trim: true,
        lowercase: true,
        minlength : [3, 'minumum charecter is 3']
    },
    phone: {
        type: String,
        required: [true, 'you must input your phone number'],
        minlength: [11, 'minimum phone length is 11'],
        maxlength: [13, 'maximum phone length is 13'],
        match: [/^[0-9]*$/, 'please input valid phone number'],
        unique: true
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
        ref: 'User',
        unique: true
    },
    education: {
        type: String,
        required: [true, 'you must input your latest education']
    },
    image: {
        type: String,
        required: [true, "you must upload your profile picture"]
    },
    location: {
        type: String,
        required: [true, "you must input your location address"]
    },
    birthDate: {
        type: Date,
        required: [true, "you must input your birth date"],
        max: [moment().subtract(15, 'years').calendar(), "minimum age is 15 years old"],
        min: [moment().subtract(60, 'years').calendar(), "maximum age is 60 years old"]
    },
    description: {
        type: String,
        required: [true, 'you must fill the description'],
        minlength : [150, 'minimum description is 150 character']
    },
}, {
    timestamps: true,
    runSettersOnQuery: true
})

userDetailSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: '{VALUE} already registered , please pick other {PATH}'
});

const UserDetail = model('UserDetail', userDetailSchema)
module.exports = UserDetail