`use strict`
const {
    hashPassword
} = require('../helpers/bcrypt')
const {
    Schema,
    model
} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'you must input username'],
        trim: true
    },
    email: {
        type: String,
        index: true,
        required: [true, 'you must enter your email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: [6, "minimum password length is 6 characters"],
        required: [true, 'you must enter your password'],
    },
    favoriteJob: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    appliedJob: [{
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        },
        status: {
            type: String,
            enum: ["waiting evaluation", "accepted", "not suitable"],
            trim: true,
            lowercase: true,
            default: "waiting evaluation"
        }
    }]
}, {
    timestamps: true,
    runSettersOnQuery: true
})

userSchema.pre('save', function (next) {
    this.password = hashPassword(this.password)
    next()
})
userSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: '{VALUE} already registered , please pick other {PATH}'
});

const User = model('User', userSchema)
module.exports = User