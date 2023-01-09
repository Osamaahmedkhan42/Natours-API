const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provode a valid email.']
    },
    photo: String,

    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not same'
        }

    },
    passwordChangedAt: Date,


})

//middle ware b/w save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

})

//checking / comparing pass
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    //console.log(await bcrypt.compare(candidatePass, userPass))
    return await bcrypt.compare(candidatePass, userPass)
}
// checking for changed passwords
userSchema.methods.changedPasswordAfter = function (JWTtimeStamp) {

    console.log(this.passwordChangedAt)
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        //console.log(changedTimeStamp, JWTtimeStamp)
        return JWTtimeStamp < changedTimeStamp
    }
    //false means no change here
    return false
}

const User = mongoose.model('User', userSchema)
module.exports = User