const express = require('express');
const authController = require('../controllers/authController')
const userController = require('./../controllers/userController');


const router = express.Router();



router.post('/signup', authController.singup)
router.post('/login', authController.login)
//reset
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)


router
    .route('/')
    .get(authController.restrictTo('admin'), userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;