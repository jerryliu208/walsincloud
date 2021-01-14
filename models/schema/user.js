const mongoose = require('mongoose')
const { Schema } = mongoose

// 員工檔
const userSchema = new Schema({
    staffId: { // 員工編號
        type: String,
        require: true
    },
    name: { // 姓名
        type: String,
        require: true
    },
    position: { // 職位
        type: String,
        require: true
    },
    email: { // 信箱
        type: String,
        require: true
    },
    password: { // 密碼(加密過的)
        type: String,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

