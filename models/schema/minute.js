const mongoose = require('mongoose')
const { Schema } = mongoose

// 會議記錄檔
const minuteSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    staffId:{ // 上傳者員工編號
        type: String,
        require: true
    },
    path: { // 檔案路徑
        type: String,
        require: true
    },
    name: { // 檔名
        type: String,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Minute', minuteSchema)

