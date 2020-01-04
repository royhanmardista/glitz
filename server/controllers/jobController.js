`use strict`
const Job = require('../models/job')
const jobApi = require('../apis/job')
const axios = require('axios')
const Company = require('../models/company')
const User = require('../models/user')
const Country = require('../models/country')
const UserDetail = require('../models/userDetail')

class jobController {

    static async updateApplicationStatus(req, res, next) {
        let {
            applicant,
            status
        } = req.body
        try {
            let updatedJob = await Job.findOneAndUpdate({
                _id: req.params.id,
                "applicants.applicantId": applicant
            }, {
                $set: {
                    "applicants.$.status": status
                }
            }, {
                new: true,
            }).populate({
                path: 'applicants.applicantId',
                select: ["_id", "username", "email"]
            })
            await User.findOneAndUpdate({
                _id: applicant,
                "appliedJob.jobId": req.params.id
            }, {
                $set: {
                    "appliedJob.$.status": status
                }

            })
            res.json({
                job: updatedJob,
                message: 'applicant status has been updated'
            })
        } catch (err) {
            next(err)
        }
    }

    static async searchJob(req, res, next) {
        let {
            country,
            description,
            minExp,
            skills
        } = req.query
        if (!minExp) {
            minExp = 7
        }
        try {
            let jobs = await Job.find({
                $or: [{
                    description: {
                        $regex: new RegExp(description),
                        $options: "i"
                    }
                }, {
                    name: {
                        $regex: new RegExp(description),
                        $options: "i"
                    }
                }],
                skills: {
                    $regex: new RegExp(skills),
                    $options: 'i'
                },
                minExp: {
                    $lte: minExp,
                },
                location: {
                    $regex: new RegExp(country),
                    $options: 'i'
                },
                userId: {
                    $ne: req.user._id
                }
            }).populate('companyId')
            if (jobs.length) {
                res.json(jobs)
            } else {
                res.status(204).json(jobs)
            }
        } catch (err) {
            next(err)
        }
    }

    static async insertMany(req, res, next) {
        Country.insertMany(JSON.parse(req.body.array))
            .then(() => {
                res.json({
                    message: 'data saved'
                })
            })
            .catch(next)
    }

    static async getCities(req, res, next) {
        try {
            let {
                data
            } = await axios({
                method: 'GET',
                url: `http://battuta.medunes.net/api/city/${req.query.country.trim()}/search/`,
                params: {
                    region: req.query.region,
                    key: "09d41e9800bdfa6510cae705a6706a18"
                }
            })
            let cities = [{
                text: "Select City",
                value: null
            }]
            data.forEach(city => {
                cities.push(city.city)
            })
            res.json(cities)
        } catch (err) {
            next(err)
        }
    }

    static async getRegions(req, res, next) {
        try {
            let {
                data
            } = await axios({
                method: 'GET',
                url: `http://battuta.medunes.net/api/region/${req.query.country.trim()}/all/?key=09d41e9800bdfa6510cae705a6706a18`
            })
            let regions = [{
                text: "Select Regions",
                value: null
            }]
            data.forEach(region => {
                regions.push(region.region)
            })
            res.json(regions)
        } catch (err) {
            next(err)
        }
    }

    static async getCountry(req, res, next) {
        try {
            let data = await Country.find()
            let locations = [{
                text: "Select Country",
                value: null
            }]
            data.forEach(location => {
                locations.push(`${location.name}, ${location.code}`)
            })
            res.json(locations)
        } catch (err) {
            next(err)
        }
    }

    static async misapply(req, res, next) {
        try {
            let job = await Job.findById(req.params.id)
            if (job) {
                try {
                    let updatedJob = await Job.findOneAndUpdate({
                        _id: req.params.id,
                        "applicants.applicantId": {
                            $in: req.user._id
                        }
                    }, {
                        $pull: {
                            applicants: {
                                "applicantId": req.user._id
                            }
                        }
                    }, {
                        new: true,
                    })
                    if (updatedJob) {
                        let user = await User.findByIdAndUpdate(req.user._id, {
                            $pull: {
                                appliedJob: {
                                    "jobId": job._id
                                }
                            }
                        }, {
                            new: true,
                            select: "-password"
                        }).populate({
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
                        res.json({
                            message: "canceling application success",
                            user
                        })
                    } else {
                        throw ({
                            status: 403,
                            message: "you have't applied to this job yet"
                        })
                    }
                } catch (err) {
                    throw (err)
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
            let userDetail = await UserDetail.findOne({
                userId: req.user._id
            })
            if (!userDetail) {
                throw ({
                    status: 405,
                    message: "It seems that you haven't complete your profile, you must complete your profile before you can apply",
                })
            }
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
                            "applicants.applicantId": {
                                $ne: req.user._id
                            }
                        }, {
                            $push: {
                                applicants: {
                                    applicantId: req.user._id
                                }
                            }
                        }, {
                            new: true,
                        })
                        if (updatedJob) {
                            let user = await User.findByIdAndUpdate(req.user._id, {
                                $push: {
                                    appliedJob: {
                                        jobId: job._id
                                    }
                                }
                            }, {
                                new: true,
                                select: "-password"
                            })
                            res.json({
                                message: "applying job success",
                                user,
                            })
                        } else {
                            throw (err)
                        }
                    } catch (err) {
                        throw ({
                            status: 403,
                            message: "you already applied this job"
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

        } catch (err) {
            next(err)
        }

    }

    static async randomJob(req, res, next) {
        let {
            location,
            description,
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
            let array = []
            for (let i = 0; i < data.length; i++) {
                let temp = {}
                temp.name = data[i].title
                temp.location = "indonesia, id"
                temp.description = data[i].description
                temp.skills = ["nodejs", "javascript", "python", "aws", "mongoDB"]
                temp.minExp = Math.round(Math.random() * 6)
                temp.userId = req.user._id
                temp.companyId = req.params.id
                array.push(temp)
            }

            Job.insertMany(array)
                .then(() => {
                    res.json({
                        message: 'data saved'
                    })
                })
                .catch(next)
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
                let exist = await Job.findOne({
                    companyId,
                    name
                })
                if (!exist) {
                    let job = await Job.create({
                        name,
                        location,
                        userId: req.user._id,
                        companyId,
                        skills,
                        minExp: Math.round(minExp),
                        description: description
                    })
                    let company = await Company.findOne({
                        user: req.user._id
                    })
                    let jobs = []
                    if (company) {
                        jobs = await Job.find({
                            companyId: company._id
                        })
                    }
                    res.json({
                        company,
                        jobs,
                        message: 'job succesfully save',
                        job
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
            }).populate({
                path: 'applicants.applicantId',
                select: ["_id", "username", "email"]
            })
            res.json(jobs)
        } catch (err) {
            next(err)
        }
    }

    static async findOne(req, res, next) {
        try {
            let job = await Job.
            findById(req.params.id).populate({
                path: 'applicants.applicantId',
                select: ["_id", "username", "email"]
            })
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

    static async destroy(req, res, next) {
        try {
            let job = await
            Job.
            findByIdAndDelete(req.params.id)
            if (job) {
                let company = await Company.findOne({
                    user: req.user._id
                })
                let jobs = []
                if (company) {
                    jobs = await Job.find({
                        companyId: company._id
                    })
                }
                res.json({
                    company,
                    jobs,
                    message: "job succesfully deleted",
                    job
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
                let company = await Company.findOne({
                    user: req.user._id
                })
                let jobs = []
                if (company) {
                    jobs = await Job.find({
                        companyId: company._id
                    })
                }
                res.json({
                    company,
                    jobs,
                    message: "job succesfully updated",
                    job
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