const mongoose = require('mongoose')
const { Schema } = mongoose

// 主持人簽核檔
const chairSignSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    chairId: { // 主持人員工編號
        type: String,
        require: true
    },
    isSign: { // 是否核准 0:未定 1:是 2:否
        type: Number,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('ChairSign', chairSignSchema)