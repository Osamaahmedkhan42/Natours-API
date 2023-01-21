const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')
mongoose.set('strictQuery', true)

dotenv.config({ path: './config.env' });


const port = process.env.PORT
//

mongoose.connect(process.env.DATABASE).then((conn) => {
    console.log("Connected to DB!!!")
});



//

app.listen(port, () => {
    console.log(`Server Listening on port ${port}`)
})

