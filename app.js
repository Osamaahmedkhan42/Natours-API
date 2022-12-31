const express = require('express')



const tourRouter = require('./routes/tourRoutes');


const app = express()



// MIDDLEWARES
app.use(express.json())

//ROUTES
app.use('/api/v1/tours', tourRouter);


module.exports = app;