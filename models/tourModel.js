const mongoose = require('mongoose')
const slugify = require('slugify')
//const validatorz = require('validator');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        maxlength: [40, "tour name must have lenth then 40"],
        //validate: [validatorz., 'This must be alphaNumerical']
    },
    slug: String,
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
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'discont price ({VALUE}) must be less then regular price'
        }
    },

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
    secretTour: { type: Boolean, default: false },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
//document middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})
tourSchema.post('save', function (doc, next) {
    //i do nothing at this moment
    next()
})
// Query Middleware
tourSchema.pre('/^find/', function (next) {
    this.find({
        secretTour: { $ne: true }
    })
    next()
})
//Agregation Middlwware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } }
    })
})

//virtual properties
tourSchema.virtual('duarationWeeks').get(function () {
    return this.duration / 7
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour