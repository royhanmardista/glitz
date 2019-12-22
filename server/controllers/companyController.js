`use strict`
const Company = require('../models/company')
const Job = require('../models/job')

class companyController {

    static async findUserCompany(req, res, next) {
        try {
            let company = await Company.findOne({ user : req.user._id})
            res.json(company)
        } catch(err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        let {
            name,
            location,
            description,
            url
        } = req.body
        try {
            let company = await Company.
            create({
                name,
                location,
                user: req.user._id,
                description: description,
                url
            })
            res.status(201).json({
                company: company,
                message: 'Your Company data has been saved'
            })
        } catch (err) {
            next(err)
        }
    }

    static async findAll(req, res, next) {
        try {
            let companies = await Company.find()
            res.json(companies)
        } catch (err) {
            next(err)
        }
    }

    static async findOne(req, res, next) {
        try {
            let company = await Company.findById(req.params.id)
            if (company) {
                let jobs = await Job.find({companyId : company._id})
                res.json({company, jobs})
            } else {
                next({
                    status: 404,
                    message: 'company not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async destroy(req, res, next) {
        try {
            let company = await Company.findByIdAndDelete(req.params.id)
            if (company) {
                res.json({
                    company: company,
                    message: "company succesfully deleted"
                })
            } else {
                next({
                    status: 404,
                    message: 'company not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async update(req, res, next) {
        let {
            name,
            location,
            description,
            url
        } = req.body
        try {
            let company = await Company.findOneAndUpdate({
                _id: req.params.id
            }, {
                name,
                location,
                description,
                url
            }, {
                upsert: true,
                new: true,
                runValidators: true,
                context: 'query'                
            })
            if (company) {
                res.json({
                    company: company,
                    message: 'company succesfully updated'
                })
            } else {
                next({
                    status: 404,
                    message: 'company not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }    
}

module.exports = companyController