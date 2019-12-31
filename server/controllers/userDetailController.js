const UserDetail = require('../models/userDetail')
const User = require('../models/user')
const univApi = require('../apis/univesity')

class userDetailController {
    static async findUniversities(req, res, next) {
        try {
            let {
                data
            } = await univApi.get('/search', {
                params: {
                    country: req.query.country
                }
            })
            let universities = [{
                text: 'Select University',
                value: null
            }]
            data.forEach(item => {
                universities.push(item.name)
            })
            res.json(universities)
        } catch (err) {
            next(err)
        }
    }
    static async findOne(req, res, next) {
        try {
            let userDetail = await UserDetail.findOne({
                userId: req.params.userId
            })
            if (userDetail) {
                let user = await User.findById(req.params.userId, "-password").populate({
                    path: 'appliedJob.jobId',
                    populate: [{
                        path: 'companyId',
                    }]
                })
                res.json({
                    user,
                    userDetail
                })
            } else {
                next({
                    status: 404,
                    message: 'user detail not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {

        let skills = []
        req.body.skills.split(',').forEach(skill => {
            skills.push(skill.trim())
        })

        const {
            fullname,
            phone,
            experience,
            education,
            image,
            location,
            birthDate,
            description
        } = req.body
        try {
            let userDetail = await UserDetail.
            create({
                skills,
                fullname,
                phone,
                experience,
                education,
                image,
                location,
                birthDate,
                userId: req.user._id,
                description
            })
            let user = await User.findById(req.user._id, "-password").populate({
                path: 'appliedJob.jobId',
                populate: [{
                    path: 'companyId',
                }]
            })
            res.status(201).json({
                message: `you have completed your profile, now you can apply to any company`,
                userDetail,
                user,
            })
        } catch (err) {
            next(err)
        }
    }

    static async update(req, res, next) {
        let skills = []
        req.body.skills.split(',').forEach(skill => {
            skills.push(skill.trim())
        })
        const {
            fullname,
            phone,
            experience,
            education,
            description,
            location,
            birthDate
        } = req.body
        try {
            let userDetail = await UserDetail.findOneAndUpdate({
                userId: req.user._id
            }, {
                fullname,
                phone,
                skills,
                experience,
                education,
                description,
                location,
                birthDate,
                userId: req.user._id
            }, {
                upsert: true,
                new: true,
                runValidators: true,
                context: 'query'
            })
            if (userDetail) {
                let user = await User.findById(req.user._id, "-password").populate({
                    path: 'appliedJob.jobId',
                    populate: [{
                        path: 'companyId',
                    }]
                })
                res.json({
                    message: 'your profile has been updated',
                    userDetail,
                    user
                })
            } else {
                throw ({
                    status: 404,
                    message: 'user detail not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async delete(req, res, next) {
        try {
            let userDetail = await UserDetail.findOneAndDelete({
                userId: req.user._id
            })
            if (userDetail) {
                res.json({
                    message: 'user detail has been deleted',
                    userDetail,
                })
            } else {
                throw ({
                    status: 404,
                    message: 'user detail not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

}

module.exports = userDetailController