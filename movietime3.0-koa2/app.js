var Koa = require('koa')
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');
const app = new Koa();
const path = require('path')
const render = require('koa-art-template')
const session = require('koa-session')
const static = require('koa-static')

var index = require('./routes/index');
var users = require('./routes/users');

// error handler
onerror(app);

// global middlewares
// app.use(views('views', {
//   root: __dirname + '/views',
//   default: 'jade'
// }));

//配置session中间件
app.keys = ['some secret hurr']  //类似cookie的签名,或者说加密盐
 
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,  //cookie的过期时间
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
 
app.use(session(CONFIG, app));



//配置art模板引擎
render(app, {
  root: path.join(__dirname, 'views'),  //视图的位置
  extname: '.html',  //后缀名
  debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
});



app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());



app.use(static(__dirname + '/public'));
app.use(static('D:\\movie'));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
