const moment = require('moment')
const Attendee = require('../models/schema/attendee')
const Conf = require('../models/schema/conference')
const ChairSign = require('../models/schema/chairSign')
const RoomSign = require('../models/schema/roomSign')
const Minute = require('../models/schema/minute')

// 處理會議資訊頁
module.exports = async (confId, user, users, confRooms) => {

    // 從會議主檔中取得這筆會議的資料
    const confInfo = await Conf.findOne({ _id: confId }).lean()

    // 從會議記錄檔中取得會議檔案
    const minutes = await Minute.find({ confId: confId, isExist: 1 }).lean()/*.sort({ 'name': 1 })*/

    // console.log(`會議資料 ${confInfo}`)

    // 轉換時間格式
    confInfo.displayStartTime = moment(confInfo.startTime).format('YYYY-MM-DDTHH:mm')
    confInfo.displayEndTime = moment(confInfo.endTime).format('YYYY-MM-DDTHH:mm')

    // 轉換時間格式 (放在使用空間簽核的視窗)
    confInfo.fulldisplayStartTime = moment(confInfo.startTime).format('YYYY-MM-DD HH:mm')
    confInfo.fulldisplayEndTime = moment(confInfo.endTime).format('YYYY-MM-DD HH:mm')

    // console.log(confInfo)

    // 從新空間檔中取得會議室資料
    const roomInfo = confRooms.find((item, index, array) => {
        return item._id.toString() === confInfo.roomId
    })

    // 從出席人員檔中取得出席者資料
    const attendees = await Attendee.find({ confId: confId, isExist: 1 }).lean()

    const attendeeList = []
    for (let [index, attendee] of attendees.entries()) {

        // 取得與會者的資料
        let atdInfo = users.find((item, index, array) => {
            return item.staffId === attendee.staffId
        })

        if (index === 0) { // 判斷是否是第一個與會者
            attendeeList.push({ // 將資料加到出席人員陣列
                attendee: attendee,
                atdInfo: atdInfo,
                isFirst: true
            })
        } else {
            attendeeList.push({ // 將資料加到出席人員陣列
                attendee: attendee,
                atdInfo: atdInfo,
                isFirst: false
            })
        }
    }

    // console.log(attendeeList)

    // 取得會議建立者的資料
    const organizer = users.find((item, index, array) => {
        return item.staffId === confInfo.organizerId
    })

    // 建立使用者身分物件
    const identity = {
        isAttendee: false,
        isOrganizer: false,
        isChair: false,
        isRoomManager: false,
    }

    // 判斷自己是否是與會者
    identity.isAttendee = attendees.find((item, index, array) => { // 在出席者中尋找自己
        return item.staffId === user.staffId // 有找到->返回陣列，沒找到->返回 undefined
    })

    // 判斷自己是否是建立者
    if (confInfo.organizerId === user.staffId) {
        identity.isOrganizer = true // 是->將使用者身分的 isOrganizer 改為 true
    }

    // 判斷自己是否是主持人
    if (confInfo.chairId === user.staffId) {
        identity.isChair = true // 是->將使用者身分的 isChair 改為 true
    }

    // 判斷自己是否是空間負責人
    if (roomInfo.managerId === user.staffId) {
        identity.isRoomManager = true // 是->將使用者身分的 isRoomManager 改為 true
    }

    // 從主持人簽核檔中取得主持人簽核狀態資料
    const chairSign = await ChairSign.findOne({ confId: confId }).lean()

    // 從使用空間簽核檔中取得使用空間簽核狀態資料
    const roomSign = await RoomSign.findOne({ confId: confId }).lean()

    return { confInfo, roomInfo, attendeeList, minutes, organizer, chairSign, roomSign, identity }

}