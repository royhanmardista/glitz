`use strict`
const User = require('./user')
const {
    Schema,
    model
} = require('mongoose')

const jobSchema = new Schema({
    name: {
        type: String,
        required: [true, 'you must fill the name'],
        lowercase: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    description: {
        type: String,
        required: [true, 'you must fill the description'],
        minlength: [150, "min discription is 150 character"]
    },
    skills: {
        type: Array,
        required: [true, 'you must fill the skills']
    },
    minExp: {
        type: Number,
        default: 0,
        min: [0, 'minimum experience is 0']
    },
    location: {
        type: String,
        required: [true, 'you must input location'],
        trim: true,
        lowercase: true
    },
    applicants: [{
        applicantId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ["waiting evaluation", "accepted", "not suitable"],
            trim: true,
            lowercase: true,
            default: "waiting evaluation"
        }
    }],
}, {
    timestamps: true,
    runSettersOnQuery: true
})

jobSchema.post('findOneAndDelete', async function (doc, next) {
    for (let i = 0; i < doc.applicants.length; i++) {
        await User.findByIdAndUpdate(doc.applicants[i].applicantId, {
            $pull: {
                appliedJob: {
                    "jobId": doc._id
                },
                favoriteJob: doc._id
            }
        })
    }
    next()
})

jobSchema.post('deleteMany', async function (doc, next) {
    if (doc.applicantId) {
        for (let i = 0; i < doc.applicants.length; i++) {
            await User.findByIdAndUpdate(doc.applicants[i].applicantId, {
                $pull: {
                    appliedJob: {
                        "jobId": doc._id
                    },
                    favoriteJob: doc._id
                }
            })
        }
    }
    next()
})

const Job = model('Job', jobSchema)
module.exports = Job