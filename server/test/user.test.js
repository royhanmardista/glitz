// install chai
const chai = require('chai')
// install chai-http
const chaiHttp = require('chai-http')

const app = require('../app')
const User = require('../models/user')

chai.use(chaiHttp)
const expect = chai.expect
//hooks 
// new user --- > pertama buat initial test buat nandain kalo jalan routernya
before(function () {
    const data = {
        username: 'sasuke',
        email: 'sasuke@gmail.com',
        password: 'sharinggan'
    }
    User.create(data)
        .then(user => {
            console.log('initial test success')
        })
        .catch(console.log)
})
// bikin hooks untuk menghapus semua data di database 
after(function (done) {
    if (process.env.NODE_ENV === 'testing') {
        User.deleteMany({})
            .then(_ => {
                console.log('all data deleted')
                done()
            })
            .catch(console.log)
    }
})


let newUser = {
    username: 'royhan',
    email: 'royhanm23@gmail.com',
    password: '123456'
}


describe(`test user sign up`, function () {
    describe(`creating new user succes`, function () {
        it(`should send a message user succesfully created with status 201 `, function (done) {
            chai.request(app)
                .post('/register')
                .send(newUser)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('user succesfully created')
                    done()
                })
        })
    })
    describe(`error process missing username`, function () {
        it(`should send a status error 400 with message you must input username`, function (done) {
            let noName = {
                ...newUser
            }
            delete noName.username
            chai.request(app)
                .post('/register')
                .send(noName)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key("message")
                    expect(res.body.message[0]).to.equal(`you must input username`)
                    done()
                })

        })
    })
    describe(`error process invalid password length`, function () {
        it(`should send a status error 404 with message minimum password is 6 characters`, function (done) {
            let noPass = {
                ...newUser
            }
            delete noPass.password
            chai.request(app)
                .post('/register')
                .send(noPass)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key("message")
                    expect(res.body.message[0]).to.equal(`minimum password is 6 characters`)
                    done()
                })
        })
    })
    
    describe(`error process duplicated email`, function () {
        it(`should send a status error 404 with message royhanm23@gmail.com already registered , please pick other email`, function (done) {
            let sameEmail = {
                ...newUser
            }
            chai.request(app)
                .post('/register')
                .send(sameEmail)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key("message")
                    expect(res.body.message[0]).to.equal(`royhanm23@gmail.com already registered , please pick other email`)
                    done()
                })
        })
    })
    describe(`error process ivalid email format`, function () {
        it(`should send a status error 404 with message Enter valid email`, function (done) {
            let invalidEmail = {
                ...newUser
            }
            invalidEmail.email = "invalid_email"
            chai.request(app)
                .post('/register')
                .send(invalidEmail)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key("message")
                    expect(res.body.message[0]).to.equal(`please input a valid email`)
                    done()
                })
        })
    })
})

let validUser = {
    email: 'royhanm23@gmail.com',
    password: '123456'
}

describe(`test user sign in`, function () {
    describe(`login user succes`, function () {
        it(`should send a message login succes with status 200 `, function (done) {
            chai.request(app)
                .post('/login')
                .send(validUser)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object").to.have.any.keys('message', 'token')
                    expect(res.body.message).to.equal('login succes')
                    done()
                })
        })
    })
    describe(`login user fail, missing email`, function () {
        it(`should send a message user not found 404 `, function (done) {
            let noEmail = {
                ...validUser
            }
            delete noEmail.email
            chai.request(app)
                .post('/login')
                .send(noEmail)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('please input a valid email')
                    done()
                })
        })
    })
    describe(`login user fail, User not found`, function () {
        it(`should send a message user not found 404 `, function (done) {
            let invalidEmail = {
                ...validUser
            }
            invalidEmail.email = "sinaga23@gmail.com"
            chai.request(app)
                .post('/login')
                .send(invalidEmail)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('User not found')
                    done()
                })
        })
    })
    describe(`login user fail, invalid password lenth`, function () {
        it(`should send a message Wrong Password 403 `, function (done) {
            let wrongPass = {
                email: 'royhanm23@gmail.com',
                password: '212'
            }
            console.log(wrongPass)
            chai.request(app)
                .post('/login')
                .send(wrongPass)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message[0]).to.equal('minimum password is 6 characters')
                    done()
                })
        })
    })
    describe(`login user fail, wrong password`, function () {
        it(`should send a message Wrong Password 403 `, function (done) {
            let wrongPass = {
                email: 'royhanm23@gmail.com',
                password: '15312312321'
            }
            console.log(wrongPass)
            chai.request(app)
                .post('/login')
                .send(wrongPass)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(403)
                    expect(res.body).to.be.an("object").to.have.key('message')
                    expect(res.body.message).to.equal('Wrong Password')
                    done()
                })
        })
    })
})