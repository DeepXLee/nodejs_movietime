var express = require('express');
var router = express.Router();
var session = require('express-session')
var md5 = require('md5');
var svgCaptcha = require('svg-captcha');
var cookieParser = require('cookie-parser');
var fs = require('fs')

var movieuser = require('../schema/movieuser')

var movieinfo = require('../schema/movieinfo')

router.use(cookieParser());
router.use(session({
  secret: 'masker',	  	  	//加密存储
  resave: false,		    //客户端并行请求是否覆盖:true-是,false-否
  saveUninitialized: true   //初始化session存储
}))

//处理静态资源
router.use(express.static('public'))

router.use('/movie', express.static('D:\\movie'))

//验证码
router.use('/captcha', function (req, res) {

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
  req.session.captcha = captcha.text;
  console.log("captcha:" + captcha.text)
  res.type('svg');
  res.status(200).send(captcha.data);
});

//判断是否非法访问
// router.use(function (req, res, next) {
//   //获取用户当前请求的地址
//   var currentUrl = req.url
//   //如果用户访问的
//   //不是登录页 && 也不是注册页   检测身份  其他则不管
//   if (currentUrl != '/login') {
//     if (!req.session.isLogin) return res.redirect('/login')
//   }
//   //其他情况（正常继续向下匹配）
//   next()
// })

//退出功能
router.get('/logout', function (req, res) {
  //1.清楚session
  req.session.isLogin = null
  req.session.userinfo = null
  //2.跳转登录页
  res.redirect('/login')
})
//登录静态页面
router.get('/login', function (req, res) {
  //加载视图
  return res.render('login.html')
})
//登录数据处理
//由于前端页面使用ajax提交表单数据,所以返回的json数据给页面自行处理下一步,非直接使用send方法和重定向方法
router.post('/login', function (req, res) {
  console.log("asfdasfasdfasfdasdfsad")
  //1.接受数据
  let whereStr = { "name": req.body.username, "password": md5(req.body.userpassword) }
  console.log("whereStr:" + whereStr)
  console.log("where:" + (req.body.verificationCode.toLowerCase().trim() != req.session.captcha.toLowerCase()))
  //检验验证码
  if (req.body.verificationCode.toLowerCase().trim() != req.session.captcha.toLowerCase()) {
    return res.status(200).json({ status: 1, msg: '验证码' })
    //res.send("<script>alert('验证码错误');location.href='/login'</script>")
  } 

  //检测用户是否存在&密码是否正确
  //根据用户名查找用户
  movieuser.find(whereStr).exec(function (err, result) {
    if (err) console.log("出错了")
    if (result.length <= 0)  return res.status(200).json({ status: 1, msg: '用户名或密码错误' })
    console.log("集合:" + result)
    req.session.isLogin = true
    req.session.userinfo = req.body.username
    return res.status(200).json({ status: 0, msg: '登录成功' })
  })
})


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
/* GET home page. */
router.get('/index', function (req, res, next) {
  res.render('index');
});

/* GET play page. */
router.get('/play', function (req, res, next) {
  res.render('play');
});

/* GET playtest page. */
router.get('/playtest', function (req, res, next) {
  res.render('playtest');
});

/* GET movie page. */
router.get('/moviepages', function (req, res, next) {
  var postData = req.query
  var limit = parseInt(postData.limit)
  var offset = parseInt(postData.offset)
  var filmName = postData.filmName
  var sort = postData.sort
  var order = postData.order

  console.log("postData:" + postData)
  console.log("limit:" + limit)
  console.log("offset:" + offset)
  console.log("filmName:" + filmName)
  console.log("sort:" + sort)
  console.log("order:" + order)
  //查询的条件
  var whereStr = {};

  if (filmName != undefined) whereStr = { "filmName": { $regex: filmName, $options: 'i' } }
  console.log("whereStr:" + whereStr)
  //正排序或倒序
  var myorder = -1
  if (order == "asc") myorder = 1;
  console.log("myorder:" + myorder)
  //排序的条件
  var key = "uploadTime"
  var mysort = {}
  var total = 0
  if (sort != undefined) key = sort
  mysort[key] = myorder

  function countmovie(whereStr, callback) {
    movieinfo.count(whereStr, (err, data) => {
      if (err) console.log(err)
      console.log("data:" + data)
      callback(data)
    })
  }

  countmovie(whereStr, (data) => {
    total = data
    movieinfo.find(whereStr).skip(offset).limit(limit).sort(mysort).exec(function (err, result) {
      if (err) return res.status(200).json({ status: 1, msg: '错误' })
      console.log("集合数:" + total)
      var results = { "total": total, "rows": result }
      //3.响应结果
      //return res.status(200).json(JSON.stringify(results))
      res.send(JSON.stringify(results));
    })
  })
})

module.exports = router;
