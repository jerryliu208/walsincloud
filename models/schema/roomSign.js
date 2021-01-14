const mongoose = require('mongoose')
const { Schema } = mongoose

// 使用空間簽核檔
const roomSignSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    roomId: { // 新空間編號
        type: String,
        require: true
    },
    managerId: { // 新空間負責人員工編號
        type: String,
        require: true
    },
    isSign: { // 是否核准 0:待確定 1:是 2:駁回
        type: Number,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RoomSign', roomSignSchema)

