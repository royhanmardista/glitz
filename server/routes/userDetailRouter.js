`use strict`
const router = require('express').Router()
const userDetailController = require('../controllers/userDetailController')
const { authenticate, userDetailAuthorization, viewUserDetailAuthorization } = require('../middlewares/auth')
const { userValidator, validate } = require('../middlewares/expressValidator')

router.use(authenticate)
router.post('/',userDetailController.create)
router.get('/:userId', viewUserDetailAuthorization, userDetailController.findOne)
router.put('/:userId', userDetailAuthorization, userDetailController.update)
router.delete('/:userId', userDetailAuthorization, userDetailController.delete)

module.exports = router