const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


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
    role: {
        type: String,
        enum: ['user', 'lead-guide', 'guide', 'admin'],
        default: 'user',
    },

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
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }


})
//middlwware not to return deleted users
userSchema.pre(/^find/, function (next) {
    //this points to current query
    this.find({
        active: { $ne: false }
    })
    next()
})
//middle ware b/w save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

})
//middle ware to create passwordUpdateAt property
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()

})


//checking / comparing pass
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    //console.log(await bcrypt.compare(candidatePass, userPass))
    return await bcrypt.compare(candidatePass, userPass)
}
// checking for changed passwords
userSchema.methods.changedPasswordAfter = function (JWTtimeStamp) {


    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        //console.log(changedTimeStamp, JWTtimeStamp)
        return JWTtimeStamp < changedTimeStamp
    }
    //false means no change here
    return false
}
//token gen
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    //hashing the token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //1000 for millisec 10 min
    //console.log(resetToken)
    //send plain token and compare the token with one encrypted in database
    return resetToken

}

const User = mongoose.model('User', userSchema)
module.exports = User