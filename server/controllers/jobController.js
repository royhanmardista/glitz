`use strict`
const Job = require('../models/job')
const jobApi = require('../apis/job')
const axios = require('axios')
const Company = require('../models/company')
const User = require('../models/user')

class jobController {

    static async misapply(req, res, next) {
        try {
            let job = await Job.findById(req.params.id)
            if (job) {
                try {
                    let updatedJob = await Job.findOneAndUpdate({
                        _id: req.params.id,
                        applicants: {
                            $in: req.user._id
                        }
                    }, {
                        $pull: {
                            applicants: req.user._id
                        }
                    }, {
                        new: true,
                    })
                    if (updatedJob) {
                        await User.findByIdAndUpdate(req.user._id, {$pull : { appliedJob : job._id }})
                        res.json({
                            message: "misapplying job success",
                            job: updatedJob
                        })
                    } else {
                        throw ({
                            status: 403,
                            message: "you have't applied to this job yet"
                        })
                    }
                } catch (err) {
                    throw(err)                    
                }
            } else {
                throw ({
                    status: 404,
                    message: 'Job not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async apply(req, res, next) {
        try {
            let job = await Job.findById(req.params.id)
            if (job) {
                if (String(job.userId) == req.user._id) {
                    throw ({
                        status: 403,
                        message: "you are not allowed to apply in your own company"
                    })
                } else {
                    try {
                        let updatedJob = await Job.findOneAndUpdate({
                            _id: req.params.id,
                            applicants: {
                                $nin: req.user._id
                            }
                        }, {
                            $push: {
                                applicants: req.user._id
                            }
                        }, {
                            upsert: true,
                            new: true,
                            runValidators: true,
                            context: 'query'
                        })
                        if (updatedJob) {
                            await User.findByIdAndUpdate(req.user._id, {$push : { appliedJob : job._id }})
                            res.json({
                                message: "applying job success",
                                job: updatedJob
                            })
                        } else {
                            throw(err)
                        }
                    } catch (err) {
                        console.log(err)
                        throw ({
                            status: 403,
                            message: "you already applied to this job"
                        })
                    }
                }
            } else {
                throw ({
                    status: 404,
                    message: 'Job not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async getJob(req, res, next) {
        console.log(req.query)
        let {
            location,
            description,
            category
        } = req.query
        if (location) {
            location = location.trim().toLowerCase()
        }
        if (description) {
            description = description.trim().toLowerCase()
        }
        try {
            let {
                data
            } = await jobApi.get('/', {
                params: {
                    description,
                    location,
                }
            })
            if (data.length >= 10) {
                res.json({
                    github: data
                })
            } else {
                let jobs2 = await axios({
                    method: 'get',
                    url: 'https://www.themuse.com/api/public/jobs?api_key=c5830b005d89c566e5af137269ab1079075e94f0f8937d3be331c416796c274e',
                    params: {
                        page: 1,
                        location,
                        category
                    }
                })
                const jobs = jobs2.data
                let result = jobs.results.filter(job => {
                    var re = new RegExp(description, "g");
                    return re.test(job.contents.toLowerCase())
                })
                let page = 2
                while (result.length < 10 && (page <= Math.floor(jobs.total / jobs.items_per_page))) {
                    let temp = []
                    let jobs2 = await axios({
                        method: 'get',
                        url: 'https://www.themuse.com/api/public/jobs?api_key=c5830b005d89c566e5af137269ab1079075e94f0f8937d3be331c416796c274e',
                        params: {
                            page,
                            location,
                            category
                        }
                    })
                    temp = jobs2.data.results.filter(job => {
                        var re = new RegExp(description, "g");
                        return re.test(job.contents.toLowerCase())
                    })
                    if (temp.length > 0) {
                        temp.forEach(element => {
                            result.push(element)
                        });
                    }
                    page++
                }
                res.json({
                    github: data,
                    themuse: result
                })
            }
        } catch (err) {
            next(err)
        }

    }
    static async create(req, res, next) {
        let companyId = req.params.companyId
        let {
            name,
            location,
            description,
            skills,
            minExp,
        } = req.body
        try {
            let company = await Company.findById(companyId)
            if (company) {
                let valid = await Job.findOne({
                    name
                })
                if (!valid) {
                    let job = await Job.create({
                        name,
                        location,
                        userId: req.user._id,
                        companyId,
                        skills,
                        minExp,
                        description: description
                    })
                    res.status(201).json({
                        job: job,
                        message: 'job succesfully save'
                    })
                } else {
                    throw ({
                        status: 400,
                        message: 'you already post this job before'
                    })
                }
            } else {
                throw ({
                    status: 404,
                    message: 'company not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async findAll(req, res, next) {
        try {
            let jobs = await Job.find({
                status: true
            }).populate('applicants', "-password")
            res.json(jobs)
        } catch (err) {
            next(err)
        }
    }

    static async findOne(req, res, next) {
        try {
            let job = await Job.
            findById(req.params.id).populate('applicants', "-password")
            if (job) {
                res.json(job)
            } else {
                next({
                    status: 404,
                    message: 'job not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static destroy(req, res, next) {
        Job.
        findByIdAndDelete(req.params.id)
            .then(job => {
                if (job) {
                    res.json({
                        job: job,
                        message: "job succesfully deleted"
                    })
                } else {
                    next({
                        status: 404,
                        message: 'job not found'
                    })
                }

            })
            .catch(next)

    }

    static async update(req, res, next) {
        let {
            name,
            location,
            description,
            skills,
            minExp
        } = req.body
        try {

            let job = await
            Job.findOneAndUpdate({
                _id: req.params.id
            }, {
                name,
                location,
                description,
                skills,
                minExp
            }, {
                upsert: true,
                new: true,
                runValidators: true,
                context: 'query'
            })
            if (job) {
                res.json({
                    job: job,
                    message: 'job succesfully updated'
                })
            } else {
                next({
                    status: 404,
                    message: 'job not found'
                })
            }

        } catch (err) {
            next(err)
        }
    }

    static async updateStatus(req, res, next) {
        let status = req.body.status || true
        try {
            let job = await Job.findOneAndUpdate({
                _id: req.params.id
            }, {
                status,
            }, {
                new: true,
                runValidators: true
            })
            if (job) {
                res.json({
                    job: job,
                    message: 'job succesfully updated'
                })
            } else {
                next({
                    status: 404,
                    message: 'job not found'
                })
            }
        } catch (err) {
            next(err)
        }
    }

}

module.exports = jobController