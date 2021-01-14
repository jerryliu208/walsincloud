const express = require('express')
const { ensureAuthenticated } = require('../config/auth')
const upload = require('../config/multer')
const { uploadMinute, deleteMinute } = require('../handler/handleMinute')
const { sendNotice } = require('../handler/handleNotice')

const router = express.Router()

// 確認進入file/...的網頁前都要登入
router.use('/', ensureAuthenticated, (req, res, next) => {
    next()
})

// 上傳檔案
router.post('/upload', upload.single('confFile'), (req, res) => {
    console.log(req.file)
    uploadMinute(req.query.id, req.user, req.file).then((data) => {

        if (data) {
            req.flash('success', '上傳成功')
        } else {
            req.flash('warning', '上傳失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.query.id}`)
    })
})

// 下載檔案
router.get('/download', (req, res) => {
    const file = `${__dirname}/../${req.query.path}/${req.query.file}`
    // console.log(file)
    res.download(file)
})

// 刪除檔案
router.get('/delete', (req, res) => {
    deleteMinute(req.query.fileId).then((data) => {
        if (data) {
            req.flash('success', '刪除成功')
        } else {
            req.flash('warning', '刪除失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.query.confId}`)
    })
})

// 發送會議通知
router.post('/sendNotice/:confId', (req, res) => {
    sendNotice(req.params.confId, req.user.staffId, req.body.employees).then((data) => {
        if (data) {
            req.flash('success', '通知已送出')
        } else {
            req.flash('warning', '通知失敗，請再試一次')
        }
        res.redirect(`/confInfo?id=${req.params.confId}`)
    })
})

module.exports = router