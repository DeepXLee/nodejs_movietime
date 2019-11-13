const mongoose = require('../db/db')
const Schema = mongoose.Schema

let movieuser = new Schema({ 'name': String, 'password': String })
module.exports = mongoose.model('movieuser', movieuser,'movieuser');