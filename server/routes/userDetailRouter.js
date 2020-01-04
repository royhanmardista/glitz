`use strict`
const router = require('express').Router()
const userDetailController = require('../controllers/userDetailController')
const { authenticate, userDetailAuthorization, viewUserDetailAuthorization } = require('../middlewares/auth')
const upload = require('../middlewares/gcsUpload')

router.use(authenticate)
router.post('/', upload.single('image'), userDetailController.create)
router.put('/', userDetailAuthorization, userDetailController.update)
router.delete('/', userDetailAuthorization, userDetailController.delete)
router.get('/universities', userDetailController.findUniversities)
router.get('/:userId', viewUserDetailAuthorization, userDetailController.findOne)

module.exports = router