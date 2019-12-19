const router = require('express').Router()
const jobController = require('../controllers/jobController')
const { authenticate, jobAuthorization }  = require('../middlewares/auth.js')

router.get('/search', jobController.getJob)
router.get('/',jobController.findAll)
router.get('/:id',jobController.findOne)
router.use(authenticate)
router.post('/:companyId',jobController.create)
router.patch('/:id', jobAuthorization, jobController.updateStatus)
router.put('/:id', jobAuthorization, jobController.update)
router.patch('/:id/apply', jobController.apply)
router.patch('/:id/misapply', jobController.misapply)
router.delete('/:id',jobAuthorization, jobController.destroy)

module.exports = router