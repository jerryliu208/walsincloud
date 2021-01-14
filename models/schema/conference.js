const mongoose = require('mongoose')
const { Schema } = mongoose

// 會議主檔
const confSchema = new Schema({
    name: { // 會議名稱
        type: String,
        require: true
    },
    organizerId:{ // 建立者員工編號
        type: String,
        require: true
    },
    startTime: { // 開始時間
        type: Date,
        require: true
    },
    endTime: { // 結束時間
        type: Date,
        require: true
    },
    topic: { // 會議主題
        type: String,
        require: true
    },
    chairId:{ // 主持人員工編號
        type: String,
        require: true
    },
    roomId:{ // 空間編號
        type: String,
        require: true
    },
    isChairSign: { // 主持人是否簽核 0:待確定 1:是 2:駁回
        type: Number,
        require: true
    },
    isRoomSign: { // 空間是否簽核 0:待確定 1:是 2:駁回
        type: Number ,
        require: true
    },
    cost: { // 成本
        type: Object,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    },
    meetingURL: { //會議連結
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Conf', confSchema)

