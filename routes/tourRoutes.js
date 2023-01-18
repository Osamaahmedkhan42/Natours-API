const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router();

//redirecting nested to review controller
router.use('/:tourID/reviews', reviewRouter)

//router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats)



router
    .route('/')
    .get(authController.protect, authController.restrictTo('admin'), tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);
// router
//     .route('/:tourID/reviews')
//     .post(authController.protect, reviewController.createReview)


module.exports = router;