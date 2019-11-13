var router = require('koa-router')();
var md5 = require('md5');
var svgCaptcha = require('svg-captcha');


var movieuser = require('../schema/movieuser')

var movieinfo = require('../schema/movieinfo')



//验证码
router.use('/captcha', async (ctx) => {

  //var option = req.query;
  var captcha = svgCaptcha.create({
    size: 4,  //验证码长度
    width: 120,
    height: 60,
    background: "#f4f3f2",
    noise: 2,//干扰线条数
    fontSize: 50,
    ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
    color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有           
  });
  // 验证码，有两个属性，text是字符，data是svg代码
  ctx.session.captcha = captcha.text;
  console.log("captcha:" + captcha.text)
  ctx.response.type = 'image/svg+xml';
  ctx.body = captcha.data;
})

//判断是否非法访问
// router.use(async (ctx,next) =>{
//   //获取用户当前请求的地址
//   var currentUrl = ctx.url
//   //如果用户访问的
//   //不是登录页 && 也不是注册页   检测身份  其他则不管
//   if (currentUrl != '/login') {
//     if (ctx.session.userinfo == undefined || ctx.session.userinfo== '') return ctx.redirect('/login')
//   }
//   //其他情况（正常继续向下匹配）
//   next()
// })



router.get('/', async (ctx)=>{
  await ctx.render('index')
})

router.get('/login', async (ctx)=>{
  await ctx.render('login')
})

//退出功能
router.get('/logout', async (ctx)=>{
  //1.清楚session
  ctx.session.isLogin = null
  ctx.session.userinfo = null
  //2.跳转登录页
  await ctx.redirect('/login')
})

module.exports = router;
