const moment = require('moment')
const ConfRoom = require('../models/schema/conferenceRoom')
const Attendee = require('../models/schema/attendee')
const Conf = require('../models/schema/conference')
const ChairSign = require('../models/schema/chairSign')
const Creater = require('../models/schema/creater')

// 處理首頁(參與的會議)
async function handleIndex(user) {
    // 從出席人員檔中取得自己參與的會議
    const attendConfs = await Attendee.find({ staffId: user.staffId, isExist: 1 }).lean()

    const confsData = []
    let userConf

    for (let conf of attendConfs) {

        let confInfo = await Conf.findOne({ _id: conf.confId }).lean() // 從會議主檔中取得會議的詳細資料

        // 轉換時間格式
        confInfo.startTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
        confInfo.endTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

        // 取得新空間資訊
        let confRoomData = await ConfRoom.findOne({ _id: confInfo.roomId }).lean()

        // 將出席資料、會議詳細資料與會議室資料放入物件
        userConf = {
            attendData: conf,
            confData: confInfo,
            confRoomData
        }

        confsData.push(userConf) // 將物件加到陣列中

    }

    // 回傳出席的會議資料
    return confsData
}

// 處理首頁(主持的會議)
async function handleChairIndex(user) {
    // 從主持人簽核檔中取得自己主持的會議
    const chairConfs = await ChairSign.find({ chairId: user.staffId, isExist: 1 }).lean()
    
    const confsData = []
    let userConf

    for (let conf of chairConfs) {

        let confInfo = await Conf.findOne({ _id: conf.confId }).lean() // 取得會議的詳細資料

        // 轉換時間格式
        confInfo.startTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
        confInfo.endTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

        // 取得新空間資訊
        let confRoomData = await ConfRoom.findOne({ _id: confInfo.roomId }).lean()

        // 將主持資料、會議詳細資料與會議室資料放入物件
        userConf = {
            chairData: conf,
            confData: confInfo,
            confRoomData
        }

        confsData.push(userConf) // 將物件加到陣列中
    }

    // 回傳主持的會議資料
    return confsData
}

// 處理首頁(創建的會議)
async function handleCreaterIndex(user) {
    // 從會議主檔中取得自己創建的會議
    const createrConfs = await Conf.find({ organizerId: user.staffId, isExist: 1 }).lean()
    const confsData = []
    let userConf

    for (let conf of createrConfs) {

        let confInfo = await Conf.findOne({ _id:conf._id, isExist: 1 }).lean() // 從會議主檔中取得會議的詳細資料
        
        // 轉換時間格式
        confInfo.startTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
        confInfo.endTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

        // 取得新空間資訊
        let confRoomData = await ConfRoom.findOne({ _id: confInfo.roomId }).lean()

        // 將創建資料、會議詳細資料與會議室資料放入物件
        userConf = {
            createrData: conf,
            confData: confInfo,
            confRoomData
        }

        confsData.push(userConf) // 將物件加到陣列中

    }

    // 回傳出席的會議資料
    return confsData
}

module.exports = { handleIndex, handleChairIndex, handleCreaterIndex }