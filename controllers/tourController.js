const Tour = require('../models/tourModel')
const factory = require('../controllers/handlerFactory')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}



exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = (async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$difficulty',
                num: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        //select all doc which are not easy
        {
            $match: {
                _id: { $ne: 'easy' }
            }
        }
    ])
    res.status(200).json({
        status: 'Sucess',
        data: stats
    })


    // try {


    // } catch (error) {
    //     res.status(404).json({
    //         status: "failed!",
    //         message: error
    //     })
    // }
})