`use strict`
const {
    Schema,
    model
} = require('mongoose')

const jobSchema = new Schema({
    name: {
        type: String,
        required: [true, 'you must fill the name'],
        lowercase : true,
        trim : true
    },
    status: {
        type: Boolean,
        default: true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    description: {
        type: String,
        required: [true, 'you must fill the description']
    },  
    skills : {
        type : Array,
        required : [true, 'you must fill the skills']
    },
    minExp : {
        type : Number,
        default : 0
    },  
    location : {
        type : String,
        required : [true, 'you must input location'],
        trim : true,
        lowercase : true
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true, runSettersOnQuery: true
})

const Job = model('Job', jobSchema)
module.exports = Job