`use strict`
const Company = require('../models/company')
const Job = require('../models/job')

class companyController {

    static async searchCompany(req, res, next) {
        let {
            country,
            description,
        } = req.query
        try {
            let companies = await Company.find({
                name: {
                    $regex: new RegExp(description),
                    $options: "i"
                },
                location: {
                    $regex: new RegExp(country),
                    $options: 'i'
                }
            })
            if (companies.length) {                
                res.json(companies)
            } else {
                res.status(204).json(companies)
            }
        } catch (err) {
            next(err)
        }
    }
    static async findUserCompany(req, res, next) {
        try {
            let company = await Company.findOne({
                user: req.user._id
            })
            let jobs = []
            if (company) {
                jobs = await Job.find({
                    companyId: company._id
                })
                res.json({
                    company,
                    jobs
                }) 
            } else {
                res.status(204).json(company)
            }
        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        let {
            name,
            location,
            description,
            url,
            category
        } = req.body
        try {
            let company = await Company.
            create({
                name,
                location,
                user: req.user._id,
                description: description,
                url,
                category
            })            
            let jobs = await Job.find({
                companyId: company._id
            })
            res.status(201).json({
                company: company,
                jobs,
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
                let jobs = await Job.find({
                    companyId: company._id
                })
                res.json({
                    company,
                    jobs
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
            url,
            category
        } = req.body
        try {
            let company = await Company.findOneAndUpdate({
                _id: req.params.id
            }, {
                name,
                location,
                description,
                url,
                category
            }, {
                upsert: true,
                new: true,
                runValidators: true,
                context: 'query'
            })
            if (company) {
                let jobs = []
                if (company) {
                    jobs = await Job.find({
                        companyId: company._id
                    })
                }
                res.json({
                    company: company,
                    jobs,
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