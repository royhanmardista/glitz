const UserDetail = require('../models/userDetail')
const moment = require('moment')

class userDetailController {

    static async findOne(req, res, next) {
        try {
            let userDetail = await UserDetail.findOne({
                userId: req.params.userId
            })
            if (userDetail) {
                res.json(userDetail)
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
        console.log(moment().subtract(15, 'years').calendar())
        const {
            fullName,
            phone,
            skills,
            experience,
            education,
            image,
            location,
            birthDate
        } = req.body
        try {
            let userDetail = await UserDetail.
            create({
                fullName,
                phone,
                skills,
                experience,
                education,
                image,
                location,
                birthDate,
                userId: req.user._id
            })
            res.status(201).json({
                message: `you have completed your profile now you can apply to any company`,
                userDetail,
            })
        } catch (err) {
            next(err)
        }
    }

    static async update(req, res, next) {
        console.log(req.params.userId, req.user._id)
        const {
            fullName,
            phone,
            skills,
            experience,
            education,
            image,
            location,
            birthDate
        } = req.body
        try {
            let userDetail = await UserDetail.findOneAndUpdate({
                userId: req.params.userId
            }, {
                fullName,
                phone,
                skills,
                experience,
                education,
                image,
                location,
                birthDate,
                userId : req.params.userId
            }, {
                upsert: true,
                new: true,
                runValidators: true,
                context: 'query'
            })
            if (userDetail) {
                res.json({
                    message: 'your profile has been updated',
                    userDetail
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
            let userDetail = await UserDetail.findOneAndDelete({userId : req.params.userId})
            if (userDetail) {
                res.json({
                    message : 'user detail has been deleted',
                    userDetail,
                })
            } else {
                throw({
                    status : 404,
                    message : 'user detail not found'
                })
            }
        } catch(err) {
            next(err)
        }
    }

}

module.exports = userDetailController