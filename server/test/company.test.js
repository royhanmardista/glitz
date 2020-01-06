// install chai
const chai = require('chai')
// install chai-http
const chaiHttp = require('chai-http')

const app = require('../app')
const Company = require('../models/company')

// ensuring this test run after user
require('./user.test')

chai.use(chaiHttp)
const expect = chai.expect
//hooks 
// new user --- > pertama buat initial test buat nandain kalo jalan routernya
before(function () {
    const data = {
        name: 'Pt Di',
        location: "Indonesia, Id",
        description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
        url: 'https://www.indonesian-aerospace.com/',
        category: 'Engineering'
    }
    Company.create(data)
        .then(company => console.log('initial test success'))
        .catch(console.log)
})
// bikin hooks untuk menghapus semua data di database 
after(function (done) {
    if (process.env.NODE_ENV === 'testing') {
        Company.deleteMany({})
            .then(_ => {
                console.log('all data deleted')
                done()
            })
            .catch(console.log)
    }
})


let newCompany = {
    name: 'Pt Dirgantara',
    location: "Indonesia, Id",
    description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
    url: 'https://www.indonesian-dirgantara.com/',
    category: 'Engineering'
}

let validUser = {
    email: 'royhanm23@gmail.com',
    password: '123456'
}

let validToken = ''

describe(`test add company`, function () {
    describe(`login user succes to get valid access token`, function () {
        it(`should send a message login succes with status 200 `, function (done) {
            chai.request(app)
                .post('/login')
                .send(validUser)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object").to.have.any.keys('message', 'token')
                    validToken = res.body.token
                    expect(res.body.message).to.equal('login succes')
                    done()
                })
        })
    })
    describe(`add new company succes`, function () {
        it(`should send an object with message Your Company data has been saved and posted company with status 201 `, function (done) {
            chai.request(app)
                .post('/companies')
                .send(newCompany)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an("object").to.have.any.keys('message', 'company')
                    expect(res.body.company).to.be.an("object").to.have.keys('name', 'location', 'description', 'url', 'category', '__v', '_id', 'createdAt', 'updatedAt', 'user')
                    expect(res.body.message).to.be.a('string').to.equal('Your Company data has been saved')
                    expect(res.body.company.name).to.equal('Pt Dirgantara')
                    expect(res.body.company.location).to.equal('Indonesia, Id')
                    expect(res.body.company.description).to.equal('Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara')
                    expect(res.body.company.category).to.equal('Engineering')
                    expect(res.body.company.url).to.equal('https://www.indonesian-dirgantara.com/')
                    done()
                })
        })
    })
    describe(`add new company fail, empty name`, function () {
        it(`should send a posted data with status 400 with message you must fill the name of your company`, function (done) {
            let noName = {
                ...newCompany
            }
            delete noName.name
            chai.request(app)
                .post('/companies')
                .send(noName)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill the name of your company')
                    done()
                })
        })
    })
    describe(`add new company fail, company name not unique`, function () {
        it(`should send a posted data with status 400 with message Pt Di already exist , please pick other name`, function (done) {
            let invalidName = {
                ...newCompany
            }
            invalidName.name = 'Pt Di'
            invalidName.url = 'https.dirgantara.com'
            chai.request(app)
                .post('/companies')
                .send(invalidName)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('Pt Di already exist , please pick other name')
                    done()
                })
        })
    })
    describe(`add new company fail, empty url`, function () {
        it(`should send a posted data with status 400 with message you must fill the url of your company`, function (done) {
            let noUrl = {
                ...newCompany
            }
            delete noUrl.url
            chai.request(app)
                .post('/companies')
                .send(noUrl)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill the url of your company')
                    done()
                })
        })
    })
    describe(`add new company fail, company url not unique`, function () {
        it(`should send a posted data with status 400 with message 'https://www.indonesian-dirgantara.com/ already exist , please pick other url`, function (done) {
            let invalidName = {
                ...newCompany
            }
            invalidName.name = 'Pt Dirgantara 2'
            chai.request(app)
                .post('/companies')
                .send(invalidName)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('https://www.indonesian-dirgantara.com/ already exist , please pick other url')
                    done()
                })
        })
    })
    describe(`add new company fail, empty location`, function () {
        it(`should send a posted data with status 400 with message please choose the location`, function (done) {
            let noLocation = {
                ...newCompany
            }
            delete noLocation.location
            chai.request(app)
                .post('/companies')
                .send(noLocation)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('please choose the location')
                    done()
                })
        })
    })
    describe(`add new company fail, invalid description length`, function () {
        it(`should send a posted data with status 400 with message minimum description length is 150 character`, function (done) {
            let invalidDescription = {
                name: 'Pt Dirgantara 4',
                location: "Indonesia, Id",
                description: "Indonesian",
                url: 'https://www.indonesian-dirgantara4.com/',
                category: 'Engineering'
            }
            chai.request(app)
                .post('/companies')
                .send(invalidDescription)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('minimum description length is 150 character')
                    done()
                })
        })
    })
    describe(`add new company fail, empty category`, function () {
        it(`should send a posted data with status 400 with message you must fill your company category`, function (done) {
            let invalid = {
                name: 'Pt Dirgantara 4',
                location: "Indonesia, Id",
                description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
                url: 'https://www.indonesian-dirgantara4.com/',
            }
            chai.request(app)
                .post('/companies')
                .send(invalid)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill your company category')
                    done()
                })
        })
    })

    describe(`add new company fail, invalid category`, function () {
        it("should send a posted data with status 400 with message `Data` is not a valid enum value for path `category`", function (done) {
            let invalid = {
                name: 'Pt Dirgantara 4',
                location: "Indonesia, Id",
                description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
                url: 'https://www.indonesian-dirgantara4.com/',
                category: 'Data'
            }
            chai.request(app)
                .post('/companies')
                .send(invalid)
                .set('token', validToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal("`Data` is not a valid enum value for path `category`.")
                    done()
                })
        })
    })

    describe(`add new company fail, not login`, function () {
        it(`should send a posted data with status 403 with message you must login first`, function (done) {
            let valid = {
                name: 'Pt Dirgantara 4',
                location: "Indonesia, Id",
                description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
                url: 'https://www.indonesian-dirgantara4.com/',
                category: 'Engineering'
            }
            chai.request(app)
                .post('/companies')
                .send(valid)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(403)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('you must login first')
                    done()
                })
        })
    })

    describe(`add new company fail, invalid (access) token`, function () {
        it(`should send a posted data with status 400 invalid token, please don't change the token in your local storage`, function (done) {
            let valid = {
                name: 'Pt Dirgantara 4',
                location: "Indonesia, Id",
                description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
                url: 'https://www.indonesian-dirgantara4.com/',
                category: 'Engineering'
            }
            let invalidToken = validToken + '0'

            chai.request(app)
                .post('/companies')
                .send(valid)
                .set('token', invalidToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal("invalid token, please don't change the token in your local storage")
                    done()
                })
        })
    })
})

let validCompany
let validCompanyId
describe(`test get companies`, function () {
    describe(`get all companies`, function () {
        it(`should send an array of companies with status 200 `, function (done) {
            chai.request(app)
                .get('/companies')
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    res.body.forEach(data => {
                        expect(data).to.have.any.keys('name', 'location', 'description', 'url', 'category', '__v', '_id', 'createdAt', 'updatedAt', 'user', 'jobs')
                    });
                    validCompany = res.body[0]._id
                    validCompanyId = res.body[1]._id
                    done()
                })
        })
    })
    describe(`get one companies succes`, function () {
        it(`should send one companies with status 200 `, function (done) {
            chai.request(app)
                .get(`/companies/${validCompany}`)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object").to.have.any.keys('name', 'location', 'description', 'url', 'category', '__v', '_id', 'createdAt', 'updatedAt', 'user', 'jobs')
                    expect(res.body.company.name).to.equal('Pt Di')
                    expect(res.body.company.location).to.equal('Indonesia, Id')
                    expect(res.body.company.description).to.equal('Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara')
                    expect(res.body.company.category).to.equal('Engineering')
                    expect(res.body.company.url).to.equal('https://www.indonesian-aerospace.com/')
                    done()
                })
        })
    })

    describe(`get one companies fail, invalid company id`, function () {
        it(`should send message invalid id and status 400`, function (done) {
            let invalidCompany = '123213'
            chai.request(app)
                .get(`/companies/${invalidCompany}`)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.any.keys('message')
                    expect(res.body.message).to.equal('CompanyId invalid')
                    done()
                })
        })
    })

    describe(`get one companies fail, company not found`, function () {
        it(`should send message company no found and status 404`, function (done) {
            let invalidCompany = validCompany.slice(0, validCompany.length - 1) + 'a'
            chai.request(app)
                .get(`/companies/${invalidCompany}`)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an("object").to.have.any.keys('message')
                    expect(res.body.message).to.equal('company not found')
                    done()
                })
        })
    })
})

let validUpdateCompany = {
    name: 'Pt Dirgantara 10',
    location: "Indonesia, Id",
    description: "Indonesian Aerospace or official Indonesian name PT Dirgantara Indonesia is an Indonesian aerospace company involved in aircraft design and the development and manufacture of civilian and military regional commuter aircraft. The company was formerly known as Industri Pesawat Terbang Nusantara",
    url: 'https://www.indonesian-aerospace10.com/',
    category: 'Engineering'
}

describe(`test update company`, function () {
    describe(`update company succes`, function () {
        it(`should send the updated company and message company succesfully updated with status 200 `, function (done) {
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object").to.have.any.keys('message', 'company', 'jobs')
                    expect(res.body.message).to.equal('company succesfully updated')
                    expect(res.body.company).to.have.any.keys('name', 'location', 'description', 'url', 'category', '__v', '_id', 'createdAt', 'updatedAt', 'user')
                    done()
                })
        })
    })

    describe(`update company fail, not authorized`, function () {
        it(`should send message You are Not Authorized with status 401`, function (done) {
            chai.request(app)
                .put(`/companies/${validCompany}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('You are Not Authorized')
                    done()
                })
        })
    })

    describe(`update company fail, company not found`, function () {
        it(`should send message company not found with status 404`, function (done) {
            chai.request(app)
                .put(`/companies/${validCompany.slice(0, validCompany.length - 1) + 'a'}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('Company not found')
                    done()
                })
        })
    })

    describe(`update company fail, invalid company id`, function () {
        it(`should send message invalid id with status 400`, function (done) {
            chai.request(app)
                .put(`/companies/'12321321'`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('CompanyId invalid')
                    done()
                })
        })
    })

    describe(`update company fail, empty update name`, function () {
        it(`should send message you must fill the name of your company with status 400`, function (done) {
            let emptyName = {
                ...validUpdateCompany
            }
            delete emptyName.name
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(emptyName)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill the name of your company')
                    done()
                })
        })
    })

    describe(`update company fail, non unique update name`, function () {
        it(`should send message Pt Di already exist , please pick other name with status 400`, function (done) {
            let invalidName = {
                ...validUpdateCompany
            }
            invalidName.name = 'Pt Di'
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(invalidName)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('Pt Di already exist , please pick other name')
                    done()
                })
        })
    })

    describe(`update company fail, empty update location`, function () {
        it(`should send message please choose the location with status 400`, function (done) {
            let emptyLocation = {
                ...validUpdateCompany
            }
            delete emptyLocation.location
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(emptyLocation)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('please choose the location')
                    done()
                })
        })
    })

    describe(`update company fail, empty update description`, function () {
        it(`should send message you must fill the description with status 400`, function (done) {
            let emptyDescription = {
                ...validUpdateCompany
            }
            delete emptyDescription.description
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(emptyDescription)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill the description')
                    done()
                })
        })
    })

    describe(`update company fail, invalid description length`, function () {
        it(`should send message minimum description length is 150 character with status 400`, function (done) {
            let invalidDescription = {
                ...validUpdateCompany
            }
            invalidDescription.description = 'ada'
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(invalidDescription)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('minimum description length is 150 character')
                    done()
                })
        })
    })

    describe(`update company fail, empty update url`, function () {
        it(`should send message you must fill the url of your company with status 400`, function (done) {
            let emptyUrl = {
                ...validUpdateCompany
            }
            delete emptyUrl.url
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(emptyUrl)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('you must fill the url of your company')
                    done()
                })
        })
    })

    describe(`update company fail, non unique update url`, function () {
        it(`should send message https://www.indonesian-aerospace.com/ already exist , please pick other url with status 400`, function (done) {
            let invalidUrl = {
                ...validUpdateCompany
            }
            invalidUrl.url = 'https://www.indonesian-aerospace.com/'
            chai.request(app)
                .put(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(invalidUrl)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('https://www.indonesian-aerospace.com/ already exist , please pick other url')
                    done()
                })
        })
    })

})

describe(`test delete company`, function () {
    describe(`delete company succes`, function () {
        it(`should send the delete company and message company succesfully deleted status 200 `, function (done) {
            chai.request(app)
                .delete(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object").to.have.any.keys('message', 'company', 'jobs')
                    expect(res.body.message).to.equal('company succesfully deleted')
                    expect(res.body.company).to.have.any.keys('name', 'location', 'description', 'url', 'category', '__v', '_id', 'createdAt', 'updatedAt', 'user')
                    done()
                })
        })
    })
    describe(`delete company fails, company not found`, function () {
        it(`should send a message Company not found with status 404 `, function (done) {
            chai.request(app)
                .delete(`/companies/${validCompanyId}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('Company not found')
                    done()
                })
        })
    })

    describe(`delete company fails, not authorized`, function () {
        it(`should send a message You are Not Authorized with status 401 `, function (done) {
            chai.request(app)
                .delete(`/companies/${validCompany}`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('You are Not Authorized')
                    done()
                })
        })
    })

    describe(`delete company fails, not login`, function () {
        it(`should send a message you must login first with status 403 `, function (done) {
            chai.request(app)
                .delete(`/companies/${validCompany}`)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(403)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('you must login first')
                    done()
                })
        })
    })

    describe(`delete company fails, invalid (access) token`, function () {
        it(`should send a message invalid token, please don't change the token in your local storage with status 400 `, function (done) {
            chai.request(app)
                .delete(`/companies/${validCompany}`)
                .set('token', validToken + '0')
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal("invalid token, please don't change the token in your local storage")
                    done()
                })
        })
    })

    describe(`delete company fails, invalid company id`, function () {
        it(`should send a message CompanyId invalid with status 400 `, function (done) {
            chai.request(app)
                .delete(`/companies/'23432424`)
                .set('token', validToken)
                .send(validUpdateCompany)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal("CompanyId invalid")
                    done()
                })
        })
    })
})