const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')
const router = express.Router()


router.use(authController.isUserLoggedIn)

router.get('/', viewsController.getOverview)
router.get('/tour/:slug', viewsController.getTours)
//login
router.get('/login', viewsController.getLoginForm)

module.exports = router
