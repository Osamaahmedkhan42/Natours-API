const express = require('express')
const appError = require('../Natours-API/utils/appError')
const globalErrorHandler = require('../Natours-API/controllers/errorController')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express()



// MIDDLEWARES
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