const Notice = require('../models/schema/notice')
const User = require('../models/schema/user')
const ConfRoom = require('../models/schema/conferenceRoom')

// 取得未看的通知數量
async function getUnCheckNoti(staffId) {
    const notice = await Notice.find({ staffId: staffId, isCheck: 0, isExist: 1 }).lean()/*.sort({ 'createdAt': -1 })*/
    return notice.length
}

// 取得所有的員工與會議室
async function getUsersRooms() {
    const users = await User.find({ isExist: 1 }).lean()/*.sort({ 'staffId': 1 })*/
    const confRooms = await ConfRoom.find({ isExist: 1 }).lean()/*.sort({ '_id': 1 })*/

    return { users, confRooms }
}

module.exports = { getUnCheckNoti, getUsersRooms }