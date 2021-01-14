const mongoose = require('mongoose')

// 連線到mongodb
function mongooseConnect() {
    // mongoose.set('debug', true) // 可在終端機看到 mongoose 的動作
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.once('open', () => { // 連線成功
        console.log('資料庫連線成功！' + process.env.DB_URL)
    }).on('error', (err) => { // 連線失敗
        console.error('connection error', err)
    })
}

module.exports = mongooseConnect