const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({

    review: {
        type: String,
        required: [true, 'Review cant be empty.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


//populating reviews
// reviewSchema.pre(/^find/, function (next) {

//     this.populate({
//         path: 'tour',
//         select: 'name'

//     }).populate({
//         path: 'user',
//         select: 'name'
//     })
//     next()
// })

reviewSchema.pre(/^find/, function (next) {

    this.populate({
        path: 'user',
        select: 'name'

    })
    next()
})



const Review = mongoose.model('Review', reviewSchema)
module.exports = Review