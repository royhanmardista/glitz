`use strict`
const Job = require('./job')

const {
    Schema,
    model
} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const companySchema = new Schema({
    name: {
        type: String,
        index: true,
        required: [true, 'you must fill the name of your company'],
        unique: true,
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'please choose the location'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'you must fill the description'],
        minlength: [150, 'minimum description length is 150 character']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    url: {
        index: true,
        type: String,
        required: [true, 'you must fill the url of your company'],
        trim: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Sales',
            'Engineering',
            'Data Science',
            'Retail',
            'Education',
            'Marketing & PR',
            'Manufacturing',
            'Creative & Design', null
        ],
        required : [true, "you must fill your company category"]
    }
}, {
    timestamps: true,
    runSettersOnQuery: true
})

companySchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: '{VALUE} already exist , please pick other {PATH}'
});
companySchema.post('findOneAndDelete', async function (doc, next) {
    console.log(doc._id)
    await Job.deleteMany({
        "companyId" : doc._id
    })
    next()
})
const Company = model('Company', companySchema)
module.exports = Company