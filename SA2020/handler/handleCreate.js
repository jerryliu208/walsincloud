const Conf = require('../models/schema/conference')
const ConfRoom = require('../models/schema/conferenceRoom')
const RoomSign = require('../models/schema/roomSign')
const ChairSign = require('../models/schema/chairSign')
const Attendee = require('../models/schema/attendee')

// 處理新增會議
module.exports = async (confData, user) => {
    // 取得輸入的資料
    const { name, startTime, endTime, chairId, topic, roomId, attendees, attendTypes } = confData
    const organizerId = user.staffId // 取得建立者(目前登入的user)的員工編號

    // 查詢新空間的資料
    const roomData = await ConfRoom.findOne({ _id: roomId })

    /*
    * 計算人事成本
    * 假設每個參與者(包括主持人)的成本都是500
    */
    let laborCost = 0
    if (typeof (attendees) === 'string') { // 只有一個參與者
        laborCost = 500 * 2
    } else {
        laborCost = (attendees.length + 1) * 500
    }

    const cost = {
        laborCost, // 人事成本
        roomCost: roomData.price // 新空間成本
    }

    // 生成會議主檔的資料
    const conf = Conf({ name, organizerId, topic, startTime, endTime, chairId, roomId, isChairSign: 0, isRoomSign: 0, cost, isExist: 1 })

    // 生成主持人簽核檔的資料
    const chairSign = ChairSign({ confId: conf._id, chairId, isSign: 0, isExist: 1 })

    // 生成使用空間簽核檔的資料
    const roomSign = RoomSign({ confId: conf._id, roomId, managerId: roomData.managerId, isSign: 0, isExist: 1 })

    // 生成出席人員檔的資料
    let attendee

    if (typeof (attendees) === 'string') { // 只有一個參與者
        attendee = Attendee({
            confId: conf._id,
            staffId: attendees,
            attendType: parseInt(attendTypes, 10),
            attendMode: 0,
            isExist: 1
        })
        // 將出席人員資料保存到出席人員檔
        attendee.save().then((data) => {
            console.log(data)
        }).catch((error) => {
            console.log(error)
            return false
        })

    } else { // 多個參與者
        for (let [inedx, item] of attendees.entries()) { 
            attendee = Attendee({
                confId: conf._id,
                staffId: item,
                attendType: parseInt(attendTypes[inedx], 10),
                attendMode: 0,
                isExist: 1
            })

            // 將出席人員資料保存到出席人員檔
            attendee.save().then((data) => {
                console.log(data)
            }).catch((error) => {
                console.log(error)
                return false
            })

        }
    }

    // 保存到資料庫
    try {
        // 將主持人簽核資料保存到主持人簽核檔
        chairSign.save().then((data) => {
            console.log(data)
        })

        // 將使用空間資料保存到使用空間簽核檔
        roomSign.save().then((data) => {
            console.log(data)
        })

        // 將會議資料保存到會議主檔
        conf.save().then((data) => {
            console.log(data)
        })

        return true // 回傳true

    } catch (error) { // 發生錯誤
        console.log(error)
        return false // 回傳false
    }

}