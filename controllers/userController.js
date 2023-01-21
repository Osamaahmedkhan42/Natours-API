const User = require('../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')




exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Plz use /singup instead'
    });
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}
exports.updateMe = catchAsync(async (req, res, next) => {

    // create err if user post password update data to this route
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError('This route is not for password update plz use /updateMyPassword', 400))
    }
    // update user doc
    const filterObj = (obj, ...allowedFileds) => {
        const newObject = {}
        Object.keys(obj).forEach(x => {
            if (allowedFileds.includes(x)) {
                newObject[x] = obj[x]
            }
        })
        return newObject
    }
    //filtration
    const filteredBody = filterObj(req.body, 'name', 'email')

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'sucess',
        data: updatedUser
    })
})

//delete me
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: 'Sucess',
        data: null
    })
})
//Dont change password with this because the pre middle ware wont run
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)