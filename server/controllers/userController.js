const User = require('../models/user')
const Job = require('../models/job')
const {
    comparePassword
} = require('../helpers/bcrypt')
const {
    generateToken
} = require('../helpers/jwt')

class userController {

    static async addFavorite(req, res, next) {
        try {
            let {
                jobId
            } = req.body
            console.log(jobId)
            let job = await Job.findById(jobId)
            if (!job) {
                throw ({
                    status: 404,
                    message: 'Job not found'
                })
            }
            let user = await User.findOneAndUpdate({
                _id: req.user._id,
                favoriteJob: {
                    $nin: jobId
                }
            }, {
                $push: {
                    favoriteJob: jobId
                }
            }, {
                select: "-password",
                new: true
            })
            if (user) {
                res.json({
                    message: "Job has successfully added to favorites",
                    user,
                })
            } else {
                throw ({
                    status: 403,
                    message: "you already added this job in your favorite"
                })
            }
        } catch (err) {
            next(err)
        }

    }

    static async removeFavorite(req, res, next) {
        try {
            let {
                jobId
            } = req.body
            let job = await Job.findById(jobId)
            if (!job) {
                throw ({
                    status: 404,
                    message: 'Job not found'
                })
            }
            let user = await User.findOneAndUpdate({
                _id: req.user._id,
                favoriteJob: {
                    $in: jobId
                }
            }, {
                $pull: {
                    favoriteJob: jobId
                }
            }, {
                select: "-password",
                new: true
            }).populate({
                path: 'appliedJob',
                populate: [{
                    path: 'companyId',
                }]
            }).populate({
                path: 'favoriteJob',
                populate: [{
                    path: 'companyId'
                }]
            })
            if (user) {
                res.json({
                    message: "Job has successfully removed from favorites",
                    user,
                })
            } else {
                throw ({
                    status: 403,
                    message: "we cannont find this job in your favorite"
                })
            }
        } catch (err) {
            next(err)
        }
    }
    static async findOne(req, res, next) {
        try {
            
            let user = await User.findById(req.user._id, "-password").populate({
                path: 'appliedJob.jobId',
                populate: [{
                    path: 'companyId',
                }]
            }).populate({
                path: 'favoriteJob',
                populate: [{
                    path: 'companyId'
                }]
            })
            if (user) {
                res.json(user)
            } else {
                next({
                    status: 404,
                    message: 'user not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static register(req, res, next) {
        const {
            email,
            username,
            password
        } = req.body
        User.
        create({
                email,
                username,
                password,
            })
            .then(user => {
                res.status(201).json({
                    message: `user succesfully created`
                })
            })
            .catch(next)
    }

    static login(req, res, next) {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    let valid = comparePassword(req.body.password, user.password)
                    if (valid) {
                        let token = generateToken(user)
                        let {
                            username,
                            email,
                            _id
                        } = user
                        res.json({
                            message: 'login succes',
                            token: token,
                            user: {
                                username,
                                email,
                                _id
                            }
                        })
                    } else {
                        next({
                            status: 403,
                            message: 'Wrong Password'
                        })
                    }
                } else {
                    next({
                        status: 404,
                        message: 'User not found'
                    })
                }
            })
            .catch(next)
    }

    static loginGoogle(req, res, next) {
        let {
            email,
            name
        } = req.decoded
        User.findOne({
                email: email
            })
            .then(user => {
                let password = email
                if (!user) {
                    return User.create({
                        email,
                        password,
                        username: name,
                    })
                } else {
                    return user
                }
            })
            .then(user => {
                let {
                    username,
                    email,
                    _id
                } = user
                let token = generateToken(user)
                res.json({
                    status: 200,
                    message: 'login success',
                    token: token,
                    user: {
                        username,
                        email,
                        _id
                    }
                })
            })
            .catch(next)
    }
}

module.exports = userController