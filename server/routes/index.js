const router = require('express').Router()
const jobRouter = require('./jobRouter')
const userRouter = require('./userRouter')
const companyRouter = require('./companyRouter')

router.use('/',userRouter)
router.use('/jobs',jobRouter)
router.use('/companies', companyRouter)

module.exports = router