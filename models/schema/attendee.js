const mongoose = require('mongoose')
const { Schema } = mongoose

// 出席人員檔
const attendeeSchema = new Schema({
    confId: { // 會議主檔編號
        type: String,
        require: true
    },
    staffId: { // 員工編號
        type: String,
        require: true
    },
    attendType: { // 參與身分 1出席、2列席
        type: Number,
        require: true
    },
    attendMode: { // 與會模式 0待確定、1在場、2在線、3離線
        type: Number,
        require: true
    },
    isExist: { // 是否存在? 1:是 0:被刪除
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Attendee', attendeeSchema)

