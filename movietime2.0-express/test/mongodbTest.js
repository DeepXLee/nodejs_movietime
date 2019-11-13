const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/'

mongoose.Promise = global.Promise

exports.connect = () => {
    if (process.env.NODE_ENV !== 'production') mongoose.set('debug', true)

    mongoose.connect(db)
    mongoose.connection.on('disconnected', () => {
        mongoose.connect(db)
    })
    mongoose.connection.on('error', err => {
        console.log(err)
    })

    mongoose.connection.once('open', () =>{
        console.log('MongoDB Connected successfully!')
    })


}