'use strict'
const {
    verifyToken
} = require('../helpers/jwt')
const User = require('../models/user')
const Job = require('../models/job')
const Company = require('../models/company')
const UserDetail = require('../models/userDetail')
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
    userDetailAuthorization: async function (req, res, next) {
        try {
            let userDetail = await UserDetail.findOne({
                userId: req.user._id
            })
            if (!userDetail) {
                throw ({
                    status: 404,
                    message: "user detail not found"
                })
            } else {
                if (String(userDetail.userId) == req.user._id) {
                    next()
                } else {
                    throw ({
                        status: 403,
                        message: 'You are Not Authorized'
                    })
                }
            }
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
        let companyId = req.params.id || req.params.companyId 
        try {
            let company = await Company.findById(companyId)
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
    },
    viewUserDetailAuthorization: async function (req, res, next) {
        try {
            let userDetail = await UserDetail.findOne({
                userId: req.params.userId
            })
            if (!userDetail) {
                throw ({
                    status: 404,
                    message: "user detail not found"
                })
            } else {
                if (String(userDetail.userId) == req.user._id) {
                    next()
                } else {
                    let employer = await Job.findOne({
                        userId: {
                            $eq: req.user._id
                        },
                        "applicants.applicantId" : req.params.userId     
                    })
                    if (employer) {
                        next()
                    } else {
                        throw ({
                            status: 403,
                            message: "only the user or the company user's applied to can view the profile"
                        })
                    }
                }
            }
        } catch (err) {
            next(err)
        }
    }

}