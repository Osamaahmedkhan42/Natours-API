const express = require('express');
const authController = require('../controllers/authController')
const userController = require('./../controllers/userController');


const router = express.Router();



router.post('/signup', authController.singup)
router.post('/login', authController.login)
//reset
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
//update current user pass
router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
//update data
router.patch('/updateMe', authController.protect, userController.updateMe)
//delete me
router.delete('/deleteMe', authController.protect, userController.deleteMe)


router
    .route('/')
    .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;