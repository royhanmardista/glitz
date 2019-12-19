'use strict'
const {
    verifyToken
} = require('../helpers/jwt')
const User = require('../models/user')
const Job = require('../models/job')
const Company = require('../models/company')

module.exports = {
    authenticate: (req, res, next) => {
        if (!req.headers.token) {
            next({
                status: 403,
                message: 'you must login first'
            })
        }
        try {
            const user = verifyToken(req.headers.token)
            User.findById(user.id)
                .then(user => {
                    if (user) {
                        req.user = user
                        next()
                    } else {
                        next({
                            message: 'user not Found',
                            status: 404
                        })
                    }
                })

        } catch (err) {
            next(err)
        }
    },
    jobAuthorization: async function (req, res, next) {
        try {
            let job = await Job.findById(req.params.id)
            if (job) {
                if (String(job.userId) == req.user._id) {
                    next()
                } else {
                    next({
                        status: 401,
                        message: 'You are Not Authorized'
                    })
                }
            } else {
                next({
                    status: 404,
                    message: 'Job not found'
                })
            }
        } catch (err) {
            next(err)
        }
    },
    companyAuthorization: async function (req, res, next) {
        try {
            let company = await Company.findById(req.params.id)
            if (company) {
                if (String(company.user) == req.user._id) {
                    next()
                } else {
                    next({
                        status: 401,
                        message: 'You are Not Authorized'
                    })
                }
            } else {
                next({
                    status: 404,
                    message: 'Company not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }
}