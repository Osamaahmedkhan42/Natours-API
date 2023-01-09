const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')

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
    console.log(req.body.passwordChangedAt)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
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