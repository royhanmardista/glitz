`use strict`
const router = require('express').Router()
const userController = require('../controllers/userController')
const loginGoogle = require('../middlewares/googleLogin')
const { authenticate } = require('../middlewares/auth')
const { userValidator, validate } = require('../middlewares/expressValidator')

router.post('/register', userValidator(), validate, userController.register)
router.post('/login', userValidator(), validate, userController.login)
router.post('/login-google', loginGoogle, userController.loginGoogle)
router.patch('/favorite', authenticate, userController.addFavorite)
router.patch('/remove/favorite', authenticate, userController.removeFavorite)
router.get('/user', authenticate, userController.findOne)

module.exports = router