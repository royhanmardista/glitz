const router = require('express').Router()
const jobController = require('../controllers/jobController')
const {
    authenticate,
    jobAuthorization,
    companyAuthorization
} = require('../middlewares/auth.js')

router.get('/country', jobController.getCountry)
router.post('/country', jobController.insertMany)
router.get('/regions', jobController.getRegions)
router.get('/cities', jobController.getCities)
router.get('/search', jobController.getJob)
router.get('/search/glintzzz', authenticate, jobController.searchJob)
router.get('/', jobController.findAll)
router.get('/:id', jobController.findOne)
router.use(authenticate)
router.post('/:id/insertMany', jobController.randomJob)
router.post('/:companyId', companyAuthorization, jobController.create)
router.patch('/:id', jobAuthorization, jobController.updateStatus)
router.put('/:id', jobAuthorization, jobController.update)
router.delete('/:id', jobAuthorization, jobController.destroy)
router.patch('/:id/apply', jobController.apply)
router.patch('/:id/misapply', jobController.misapply)
router.patch('/:id/applicant', jobAuthorization, jobController.updateApplicationStatus)
module.exports = router