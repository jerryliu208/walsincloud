const moment = require('moment')
const ChairSign = require('../models/schema/chairSign')
const RoomSign = require('../models/schema/roomSign')
const Conf = require('../models/schema/conference')
const ConfRoom = require('../models/schema/conferenceRoom')

// 處理待簽核會議的頁面
module.exports = async (user) => {
    // 找到自己是主持人且待審核的會議
    const chairConfs = await ChairSign.find({ chairId: user.staffId, $or: [{ isSign: 0 }, { isSign: 2 }], isExist: 1 }).lean()

    // 找到自己是使用空間負責人且待審核的會議
    const roomConfs = await RoomSign.find({ managerId: user.staffId, $or: [{ isSign: 0 }, { isSign: 2 }], isExist: 1 }).lean()

    // 處理要回傳的會議資料(主持)
    for (let [index, conf] of chairConfs.entries()) {
        // 取得會議詳細資料
        const confInfo = await Conf.findOne({ _id: conf.confId, isExist: 1 }).lean()

        // 轉換時間格式
        confInfo.startTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
        confInfo.endTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

        // 取得新空間資料
        const roomInfo = await ConfRoom.findOne({ _id: confInfo.roomId, isExist: 1 }).lean()

        
        chairConfs[index].confInfo = confInfo // 將會議詳細資料存到chairConfs陣列中
        chairConfs[index].roomInfo = roomInfo // 將新空間資料資料存到chairConfs陣列中
    }

    // 處理要回傳的會議資料(空間負責)
    for (let [index, conf] of roomConfs.entries()) {
        // 取得會議詳細資料
        const confInfo = await Conf.findOne({ _id: conf.confId, isExist: 1 }).lean() 

        // 轉換時間格式
        confInfo.startTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
        confInfo.endTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

        // 取得新空間資料
        const roomInfo = await ConfRoom.findOne({ _id: confInfo.roomId, isExist: 1 }).lean()

        roomConfs[index].confInfo = confInfo // 將會議詳細資料存到roomConfs陣列中
        roomConfs[index].roomInfo = roomInfo // 將新空間資料資料存到roomConfs陣列中
    }

    // 回傳 主持的會議以及自己是使用空間負責人的會議
    return { chairConfs, roomConfs }

}