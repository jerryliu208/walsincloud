const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/schema/user')

module.exports = (passport) => {
    passport.use(new LocalStrategy({ // 使用 LocalStrategy 本地驗證
        usernameField: 'staffId', // 改以名為 staffId 的欄位作為帳號
        passReqToCallback: true // 讓 varify callback 函式可以取得 req 物件

    }, (req, staffId, password, done) => {

        User.findOne({ staffId: staffId }).then(async (user) => { // 查詢使用者

            if (!user) { // 找不到此user
                // 驗證失敗時，不提供 Passport 使用者資料
                return done(null, false, req.flash('warning', '此帳號不存在'))
            }
            const isMatched = await bcrypt.compare(password, user.password) // 使用 bcrypt 驗證密碼是否正確

            if (!isMatched) { // 密碼錯誤
                return done(null, false, req.flash('warning', '帳號或密碼錯誤'))
            }
            return done(null, user) // 驗證成功，提供 Passport 使用者的資料
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.staffId) // 將 staffId 序列化存到 session 中
    })

    passport.deserializeUser((staffId, done) => {
        User.findOne({ staffId: staffId }, (err, user) => {
            done(err, user)
        })
    })
}