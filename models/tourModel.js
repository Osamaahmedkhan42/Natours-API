const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have dificulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0

    },
    price: {
        type: Number,
        required: [true, 'A tour must have price']
    },
    priceDiscount: Number,
    Summary: {
        type: String,
        trim: true
    },
    discription: {
        type: String,
        //required: [true, 'A tour must have discription'],
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        deafult: new Date()
    },
    startDates: [Date],





})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour