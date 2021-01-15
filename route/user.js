const express = require('express')
const passport = require('passport')
const { notAuthenticated, MnotAuthenticated } = require('../config/auth')

const router = express.Router()

// 登入頁面
router.get('/login', notAuthenticated, (req, res) => {
    res.render('login', {
        title: '登入'
    })
})
// 手機登入頁面
router.get('/mobilelogin', MnotAuthenticated, (req, res) => {
    res.render('mobilelogin', {
        title: '手機登入'
    })
})
// 登入
router.post('/login', passport.authenticate('local', { // 使用 passport 做登入驗證
    successRedirect: '/', // 登入成功，前往會議列表
    failureRedirect: '/users/login' // 登入失敗，前往登入頁
}))
// 手機登入
router.post('/mobilelogin', passport.authenticate('local', { // 使用 passport 做登入驗證
    successRedirect: '/mobileindex', // 登入成功，前往會議列表
    failureRedirect: '/users/mobilelogin' // 登入失敗，前往登入頁
}))

// 登出
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', '您已成功登出！')
    res.redirect('/users/login')
    console.log(req.session)
    console.log('User', req.user)
})
// //手機//登出
router.get('/mobilelogout', (req, res) => {
    req.logout()
    req.flash('success', '您已成功登出！')
    res.redirect('/users/mobilelogin')
    console.log(req.session)
    console.log('User', req.user)
})

module.exports = router