// 引入套件
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

// 引入路由
const userRoutes = require('./route/user')
const confRoutes = require('./route/conf')
const signRoutes = require('./route/sign')
const file = require('./route/file')

const mongooseConnect = require('./models/mongoose')
const helpers = require('./util/helpers')

const app = express()

// 設定 handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: helpers
}))

app.set('view engine', 'hbs') // 使用 handlebars 作為模板引擎

// 設定靜態資源的位置
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false })) // 使用 body-parser 解析 req.body

app.use(session({
    secret: 'kdmaijieqdakojekodabf', // 自訂私鑰
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize()) // 初始化 Passport

app.use(passport.session()) // 如果要使用 login session 就要設定

// 載入 Passport config
require('./config/passport')(passport)

// 登入後取得使用者的資訊
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.success = req.flash('success')
    res.locals.warning = req.flash('warning')
    next()
})

// 開啟資料庫
mongooseConnect()

// 路由
app.use('/users', userRoutes)
app.use('/', confRoutes)
app.use('/sign', signRoutes)
app.use('/file', file)

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});