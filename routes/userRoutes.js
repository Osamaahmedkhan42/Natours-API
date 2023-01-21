const express = require('express');
const authController = require('../controllers/authController')
const userController = require('./../controllers/userController');


const router = express.Router();



router.post('/signup', authController.singup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

//all routes below this will use protect middleware
router.use(authController.protect)
//My info
router.get('/me', userController.getMe, userController.getUser)
//update current user pass
router.patch('/updateMyPassword', authController.updatePassword)
//update data
router.patch('/updateMe', userController.updateMe)
//delete me
router.delete('/deleteMe', userController.deleteMe)

router.use(authController.restrictTo('admin'))
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;