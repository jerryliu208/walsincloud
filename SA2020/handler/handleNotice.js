const moment = require('moment')
const Notice = require('../models/schema/notice')
const User = require('../models/schema/user')
const Conf = require('../models/schema/conference')

// 發送會議通知
async function sendNotice(confId, senderStaffId, employees) {
    // console.log(employees)

    let employee

    try {
        if (typeof (employees) === 'string') { // 只有一個被通知者
            // 生成通知檔的資料
            employee = Notice({
                confId: confId, // 會議id
                senderStaffId, // 發送通知者的員工編號
                staffId: employees, // 被通知者的員工編號
                isCheck: 0, // 是否看過通知，預設為 0
                mode:1,
                isExist: 1
            })

            // 將資料保存到通知檔
            employee.save().then((data) => {
                console.log(data)
            })

        } else { // 多被通知者
            for (let item of employees) {
                // 生成通知檔的資料
                employee = Notice({
                    confId: confId,
                    senderStaffId,
                    staffId: item,
                    isCheck: 0,
                    mode:1,
                    isExist: 1
                })

                // 將資料保存到通知檔
                employee.save().then((data) => {
                    console.log(data)
                })
            }
        }

        return true

    } catch (error) {
        console.log(error)
        return false
    }

}

// 通知中心
async function noticeList(staffId) {

    // 取得自己收到的通知
    let notifications = await Notice.find({ staffId: staffId, isExist: 1 }).lean()/*.sort({ 'createdAt': -1 })*/

    for (let [index, item] of notifications.entries()) {
        // 轉換時間格式
        notifications[index].sendTime = moment(item.createdAt).format('YYYY-MM-DD HH:mm')
        // 從員工檔中取得寄件人的資料
        notifications[index].sender = await User.findOne({ staffId: item.senderStaffId }).lean()
        // 從會議主檔中取得會議資料
        notifications[index].confInfo = await Conf.findOne({ _id: item.confId }).lean()
    }

    // console.log(notifications)

    // 回傳通知資料
    return notifications
}

// 查看通知中心的會議
function enterNoticeConf(noticeId) {
    const updateItem = { isCheck: 1 }
    // 將通知檔的 isCheck 改為 1
    return Notice.updateOne({ _id: noticeId }, updateItem)
}

module.exports = { sendNotice, noticeList, enterNoticeConf }