const express = require('express')
const { ensureAuthenticated } = require('../config/auth')
const { handleRoomSign, handleChairSign,} = require('../handler/handleSign')

const handleAttendMode = require('../handler/handleAttendMode')
const handleCheckList = require('../handler/handleCheckList')
const { getUnCheckNoti } = require('../handler/getUsual')

const router = express.Router()

// 待審核列表
router.get('/', ensureAuthenticated, async (req, res) => {
    const noticeNum = await getUnCheckNoti(req.user.staffId)
    const { chairConfs, roomConfs } = await handleCheckList(req.user)

    res.render('checkList', {
        name: req.user.name,
        title: '待核准會議',
        chairConfs,
        roomConfs,
        noticeNum
    })
})


// 空間負責人簽核
router.post('/room', ensureAuthenticated, (req, res) => {
    handleRoomSign(req.query.id, req.body.isRoomSign).then((data) => {
        if (data.isSuccess) {
            if (data.isAllow) { // 簽核成功
                req.flash('success', '已簽核使用空間')
            } else { // 駁回
                req.flash('warning', '已駁回使用空間')
            }

        } else {
            req.flash('warning', '簽核失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.query.id}`)
    })
})

// 主持人簽核
router.post('/chair', ensureAuthenticated, (req, res) => {
    handleChairSign(req.query.id, req.body.isSign).then((data) => {
        if (data.isSuccess) {
            if (data.isAllow) { // 簽核成功
                req.flash('success', '已簽核此會議')
            } else { // 駁回
                req.flash('warning', '已駁回此會議')
            }

        } else {
            req.flash('warning', '簽核失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.query.id}`)
    })
})


// 選擇與會模式
router.post('/attendMode', ensureAuthenticated, (req, res) => {
    handleAttendMode(req.query.id, req.body.attendmode, req.user.staffId).then((data) => {
        if (data) {
            req.flash('success', '已選擇與會模式')
        } else {
            req.flash('warning', '選擇失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.query.id}`)
    })
})


module.exports = router