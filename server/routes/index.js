const router = require('express').Router()
const jobRouter = require('./jobRouter')
const userRouter = require('./userRouter')
const companyRouter = require('./companyRouter')
const userDetailRouter = require('./userDetailRouter')

router.use('/',userRouter)
router.use('/profile', userDetailRouter)
router.use('/jobs',jobRouter)
router.use('/companies', companyRouter)

module.exports = router