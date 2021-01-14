const mongoose = require('mongoose')
const { Schema } = mongoose

// 新空間檔
const confRoomSchema = new Schema({
    name: { // 會議室名稱
        type: String,
        require: true
    },
    location: { // 地址
        type: String,
        require: true
    },
    managerId: { // 負責人員工編號
        type: String,
        require: true
    },
    accommodate: { // 容納人數
        type: Number,
        require: true
    },
    price: { // 價格(用來計算會議成本)
        type: Number,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('ConfRoom', confRoomSchema)

