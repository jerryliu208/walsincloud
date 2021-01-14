const mongoose = require('mongoose')
const { Schema } = mongoose

// 創建人員檔
const createrSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    organizerId: { // 創建人員工編號
        type: String,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Creater', createrSchema)