const mongoose = require('mongoose');
var dburl = "mongodb://localhost:27017/movietime";

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', function () {

    console.log('Mongoose connection open to ' + dburl);
}); /** * 连接异常 */

mongoose.connection.on('error', function (err) {

    console.log('Mongoose connection error: ' + err);
}); /** * 连接断开 */

mongoose.connection.on('disconnected', function () {

    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;