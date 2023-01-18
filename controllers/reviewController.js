const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourID) filter = { tour: req.params.tourID }
    const reviews = await Review.find(filter)
    res.status(200).json({
        status: 'Sucess',
        result: reviews.length,
        data: {
            reviews
        }
    })
})
exports.setUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourID
    if (!req.body.user) req.body.user = req.user.id
    next()
}
exports.createReview = factory.createOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)