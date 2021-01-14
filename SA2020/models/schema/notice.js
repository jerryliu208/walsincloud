const mongoose = require('mongoose')
const { Schema } = mongoose

// 會議通知檔
const noticeSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    senderStaffId: { // 發送者員工編號
        type: String,
        require: true
    },
    staffId:{ // 接收者員工編號
        type: String,
        require: true
    },
    isCheck: { // 是否看過? 1:是 0:否
        type: Boolean,
        required: true
    },
    mode: { // 哪種通知? 0:會議通知 1:會議紀錄
        type: String,
        required: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Notice', noticeSchema)

