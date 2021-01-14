const Conf = require('../models/schema/conference')
const ConfRoom = require('../models/schema/conferenceRoom')
const RoomSign = require('../models/schema/roomSign')
const ChairSign = require('../models/schema/chairSign')
const Attendee = require('../models/schema/attendee')
const Notice = require('../models/schema/notice')

// 處理空間負責人簽核
async function handleRoomSign(confId, isSign) {

    if (isSign === '1') { // 核准→不可再次審核
        try {
            await Conf.updateOne({ _id: confId }, { isRoomSign: 1 }) // 更新會議主檔
            await RoomSign.updateOne({ confId: confId }, { isSign: 1 }) // 更新會議室簽核檔
            return { isSuccess: true, isAllow: true }
        } catch (error) {
            return { isSuccess: false }
        }

    } else { // 駁回→可修改後再次審核
        try {
            await Conf.updateOne({ _id: confId }, { isRoomSign: 2 }) // 更新會議主檔
            await RoomSign.updateOne({ confId: confId }, { isSign: 2 }) // 更新會議室簽核檔
            return { isSuccess: true, isAllow: false }
        } catch (error) {
            return { isSuccess: false }
        }
    }
}

// 處理主持人簽核
async function handleChairSign(confId, isSign) {
    
    if (isSign === '1') { // 核准→不可再次審核
        try {
            await Conf.updateOne({ _id: confId }, { isChairSign: 1 }) // 更新會議主檔
            await ChairSign.updateOne({ confId: confId }, { isSign: 1 }) // 更新主持人簽核檔
            /////////////////發送會議通知//////////////////////////
            // 從出席人員檔中取得該會議所有出席人員
            const attendConfs = await Attendee.find({ confId: confId, isExist: 1 }).lean()
            const chairConfs = await Conf.findOne({ _id: confId}).lean()
            let employee
            for (let item of attendConfs) {
                // 生成通知檔的資料
                employee = Notice({
                    confId: confId,
                    senderStaffId: chairConfs.chairId,
                    staffId: item.staffId,
                    isCheck: 0,
                    mode:0,
                    isExist: 1
                })

                // 將資料保存到通知檔
                employee.save().then((data) => {
                    console.log(data)
                })
            }
            /////////////////發送會議通知//////////////////////////
            return { isSuccess: true, isAllow: true }
        } catch (error) {
            return { isSuccess: false }
        }

    } else { // 駁回→可修改後再次審核
        try {
            await Conf.updateOne({ _id: confId }, { isChairSign: 2 }) // 更新會議主檔
            await ChairSign.updateOne({ confId: confId }, { isSign: 2 }) // 更新主持人簽核檔
            return { isSuccess: true, isAllow: false }
        } catch (error) {
            return { isSuccess: false }
        }
    }


}

module.exports = { handleRoomSign, handleChairSign }