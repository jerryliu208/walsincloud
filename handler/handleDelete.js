const Conf = require('../models/schema/conference')
const RoomSign = require('../models/schema/roomSign')
const ChairSign = require('../models/schema/chairSign')
const Attendee = require('../models/schema/attendee')
const Minute = require('../models/schema/minute')
const Notice = require('../models/schema/notice')

// 處理刪除會議
module.exports = async (confId) => {
    // 生成更新資料
    const updateItem = { isExist: 0 }
    
    try {
        await Conf.updateOne({ _id: confId }, updateItem) // 更新會議主檔
        await ChairSign.updateOne({ confId: confId }, updateItem) // 更新主持人簽核檔
        await RoomSign.updateOne({ confId: confId }, updateItem) // 更新使用空間簽核檔
        await Attendee.updateMany({ confId: confId }, updateItem) // 更新出席人員檔
        await Minute.updateMany({ confId: confId }, updateItem) // 更新會議記錄檔
        await Notice.updateMany({ confId: confId }, updateItem) // 更新會議通知檔

        return true // 回傳true

    } catch (error) { // 如果發生錯誤
        console.log(error)
        return false // 回傳false
    }

}