const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const sendEmail = require('../utils/email')

//sign token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


exports.singup = catchAsync(async (req, res, next) => {
    // This approch has a serious flaw any body can send anything in the body and can register himself 
    // const newUser = await User.create(req.body)

    //FIX
    // console.log(req.body.passwordChangedAt)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,


    })
    //signing jwt token
    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'sucess',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    // 1) check if email and pass exsists in body
    if (!email || !password) {
        next(new appError('Plz provide email and password', 400))
    }
    // 2) if password is correct
    const user = await User.findOne({ email }).select('+password')
    //calling our instance method defined in model
    //const correct = await user.correctPassword(password, user.password)
    //null  !null ===true
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new appError('Incorrect Email or Password', 401))
    }
    // 3) if ok send token to clinet
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

//Middle ware for auth roues
exports.protect = catchAsync(async (req, res, next) => {
    // 1.If the token is there
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        next(new appError('You are not logged In!', 401))
    }
    // 2.verify
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //console.log(decoded)
    // 3.user exsists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new appError('The user belonging to this token does not exsists', 401))
    }
    // 4.if user chnage password after JWt was issued

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('User changed password recently!.plz login again', 401))
    }
    req.user = freshUser
    next()
})

//authorization
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles is an array
        if (!roles.includes(req.user.role)) {
            return next(new appError('You dont have permission to perform this action', 403))
        }
        next()
    }
}
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //get user based on email
    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) {
        return next(new appError('Email address in not valid', 404))
    }
    //gen random token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    //send it back as an email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your pass make a patch request to ${resetURL} with pass and passConfirm.\n If you did not forgot your pass plz ignore this email`
    try {
        await sendEmail({

            email: user.email,
            subject: 'this token expires in 10 min',
            message
        })
        res.status(200).json({
            status: 'Sucess',
            message: 'Token sent to email'
        })
    } catch (error) {
        //console.log(error)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        //saving changes to db
        await user.save({ validateBeforeSave: false })
        return next(new appError('There was error sending email.Try again later', 500))

    }

})
exports.resetPassword = (req, res, next) => {

}