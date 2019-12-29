const router = require('express').Router()
const companyController = require('../controllers/companyController')
const {
    authenticate,
    companyAuthorization
} = require('../middlewares/auth.js')

router.get('/', companyController.findAll)
router.get('/user', authenticate, companyController.findUserCompany)
router.get('/search', companyController.searchCompany)
router.get('/:id', companyController.findOne)
router.use(authenticate)
router.post('/', companyController.create)
router.delete('/:id', companyAuthorization, companyController.destroy)
router.put('/:id', companyAuthorization, companyController.update)

module.exports = router