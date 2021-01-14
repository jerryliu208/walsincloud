const Conf = require('../models/schema/conference')
const ConfRoom = require('../models/schema/conferenceRoom')
const RoomSign = require('../models/schema/roomSign')

// 處理更改使用空間
module.exports = async (confId, confData) => {

    // 取得輸入的資料
    const { roomId } = confData

    // 從新空間檔中查詢新空間的資料
    const roomData = await ConfRoom.findOne({ _id: roomId })

    // 生成新空間簽核檔要修改的資料
    const updateItem = { roomId: roomId, managerId: roomData.managerId, isSign: 0 }

    // 生成會議主檔要修改的資料
    const confUpdate = { roomId, isRoomSign: 0 }

    try {
        await RoomSign.updateOne({ confId: confId }, updateItem) // 更新使用空間簽核檔
        await Conf.updateOne({ _id: confId }, confUpdate) // 更新會議主檔
        return true
    } catch (error) { // 發生錯誤
        console.log(error)
        return false // 回傳 false
    }

}