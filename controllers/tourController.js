const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const appError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}



exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    //final query

    const tours = await features.query



    //const tours = await Tour.find(queryObj)
    res.status(200).json({
        status: 'Sucess',
        results: tours.length,
        data: {
            tours
        }
    })
    // try {


    // } catch (error) {

    //     res.status(404).json({
    //         status: "failed!",
    //         message: error
    //     })
    // }

});

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id).populate('reviews')

    //handling 404
    if (!tour) {
        return next(new appError('No tour found with that ID', 404))
    }
    //const tours = await Tour.findOne({ name: req.params.id })
    res.status(200).json({
        status: 'Sucess',
        // results: tours.length,
        data: {
            tour
        }
    })
    // try {
    //     //console.log(queryObj)
    //     //console.log(req.params)

    // } catch (error) {

    //     res.status(404).json({
    //         status: "failed!",
    //         message: error
    //     })
    // }

});

exports.createTour = factory.createOne(Tour)
// exports.createTour = catchAsync(async (req, res, next) => {
//     // console.log(req.body);
//     //const newTour = new Tour()
//     const newTour = await Tour.create(req.body)
//     res.status(201).json({
//         status: 'Sucess',
//         data: {
//             tour: newTour
//         }
//     })
// try {

// } catch (error) {
//     console.log(error)
//     res.status(400).json({
//         status: "failed!",
//         message: error
//     })
// }
// });

//update//
exports.updateTour = factory.updateOne(Tour)
// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//     if (!tour) {
//         return next(new appError('No tour found with that ID', 404))
//     }
//     res.status(200).json({
//         status: 'Sucess',

//         data: {
//             tour
//         }
//     })
// try {

// } catch (error) {

//     res.status(404).json({
//         status: "failed!",
//         message: error
//     })
// }
// });
exports.deleteTour = factory.deleteOne(Tour)
// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id)
//     if (!tour) {
//         return next(new appError('No tour found with that ID', 404))
//     }
//     res.status(204).json({
//         status: 'Sucess',
//         data: null
//     })
// try {

// } catch (error) {
//     res.status(404).json({
//         status: "failed!",
//         message: error
//     })
// }
// });

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