const express = require('express')
const cookieParser = require('cookie-parser')
const appError = require('../Natours-API/utils/appError')
const globalErrorHandler = require('../Natours-API/controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes')


const app = express()
//setting templete engine
app.set('view engine', 'pug')
app.set('views', './views')

//serving static sites
app.use(express.static('./public'))

//limiter
const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: "Too many requests try agin later after 1 hour"
})




// MIDDLEWARES
app.use(helmet())
app.use('/api', limiter)
app.use(express.json({
    limit: '10kb'
}))
app.use(cookieParser())
//data sanitize for NoSQL injection and XSS
app.use(mongoSanitize())
app.use(xss())
//parimeter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price']
}))



//ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)

//unhandeled routes
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // })

    // const err = new Error()
    // err.statusCode = 404
    // err.message = `Can't find ${req.originalUrl} on the server!`
    // next(err)

    next(new appError(`Can't find ${req.originalUrl} on the server!`, 404))

})
//error handler middleware
app.use(globalErrorHandler)

module.exports = app;