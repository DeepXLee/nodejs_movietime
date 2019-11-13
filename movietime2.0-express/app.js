var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser') //解析POST请求数据
var fs = require('fs')


var movieinfo = require('./schema/movieinfo')

const chokidar = require('chokidar');//监控文件夹插件
//绑定log
const log = console.log.bind(console);

function findMovie(whereStr, callback) {
  movieinfo.find(whereStr, (err, data) => {
    if (err) log(err)
    callback(data)
  })
}

//设置监控的目录
const watcher = chokidar.watch('D:\\movie', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
//增加文件
watcher.on('add', path => {
  //log("path:" + path)
  fs.stat(path, function (err, stats) {
    if (err) log("错误")
    var filmName = path.substring(path.lastIndexOf("\\") + 1)
    log("filmName:" + filmName)
    var whereStr = { "filmName": filmName }
    findMovie(whereStr, (data) => {
      if (err) log(err)
      if (data== undefined || data==0) {
        var uploadTime = stats.birthtime
        var size = stats.size
        var fileType = path.substring(path.lastIndexOf(".") + 1)
        var hotWord = ''
        var playTimes = 0
        var downloadTimes = 0

        var movie = new movieinfo({ "filmName": filmName, "uploadTime": uploadTime, "size": size, "fileType": fileType, "hotWord": hotWord, "playTimes": playTimes, "downloadTimes": downloadTimes })
        log("movie:" + movie)
        movie.save((err,res) => {
          //log("成功保存"+res.n+"条数据")
        })
      }
    })
  })
})
//修改文件
watcher.on('change', path => log(`File ${path} has been changed`))
//删除文件
watcher.on('unlink', path => {
  fs.stat(path, function (err, stats) {
    if (err) log("错误")
    var filmName = path.substring(path.lastIndexOf("\\") + 1)
    var whereStr = { "filmName": filmName }
    movieinfo.remove(whereStr, (err, res) => {
      log('成功删除' + res.n + '条数据')
    })
  })
})



var indexRouter = require('./routes/index');
var datasRouter = require('./routes/datas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');
app.use('/public', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
app.use(bodyParser.json()); 					    //解析JSON格式数据（application/json）     解析后放到req对象的body属性中
app.use(bodyParser.urlencoded({ extended: false }));//解析文本格式数据（application/x-www-form-urlencoded）

app.use(logger('dev'));
app.use(cookieParser());

app.use('/datas', datasRouter);
app.use('/', indexRouter);//路由模块化


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
