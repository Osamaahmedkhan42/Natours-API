const nodemailer = require('nodemailer')

//transporter
// const transporter = nodemailer.createTransport({
//     service:'Gmail',
//     auth:{
//         user: process.env.USER_NAME,
//         pass: process.env.PASS
//     }
//     //activate lesssecure app in gmail
// })

//using mailTrap

const sendEmail = async options => {
    //create transport

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

    })
    //options
    const mailOptions = {
        from: 'Osama Ahmed',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //send

    await transporter.sendMail(mailOptions)
}


module.exports = sendEmail