const mongoose = require('../db/db')
const Schema = mongoose.Schema

let  movieSchema = new Schema({
    'filmName':{
        'unique':true,
        'type':String},
    'uploadTime':Number,
    'size':Number,
    'fileType':String,
    'hotWord':String,
    'playTimes':Number,
    'downloadTimes':Number
})

module.exports = mongoose.model('movie',movieSchema,'movieinfo')