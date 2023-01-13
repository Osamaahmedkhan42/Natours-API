const express = require('express')
const appError = require('../Natours-API/utils/appError')
const globalErrorHandler = require('../Natours-API/controllers/errorController')
const rateLimit = require('express-rate-limit')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express()

//limiter
const limiter = rateLimit({
    max: 3,
    window: 60 * 60 * 1000,
    message: "Too many requests try agin later after 1 hour"
})



// MIDDLEWARES
app.use('/api', limiter)
app.use(express.json())


//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)

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