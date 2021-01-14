const Conf = require('../models/schema/conference')
const ConfRoom = require('../models/schema/conferenceRoom')
const RoomSign = require('../models/schema/roomSign')
const ChairSign = require('../models/schema/chairSign')
const Attendee = require('../models/schema/attendee')

// 處理編輯會議
module.exports = async (confId, confData) => {

    let successNum = 0

    console.log(confData)

    // 取得輸入的資料
    const { name, startTime, endTime, chairId, topic, roomId, attendees, attendTypes } = confData

    // 從新空間檔中查詢新空間的資料
    const roomData = await ConfRoom.findOne({ _id: roomId })

    // 假設每個參與者(包括主持人)的成本都是500
    let laborCost = 0
    if (typeof (attendees) === 'string') { // 只有一個參與者
        laborCost = 500 * 2
    } else {
        laborCost = (attendees.length + 1) * 500
    }

    // 計算成本
    const cost = {
        laborCost, // 人事成本
        roomCost: roomData.price // 新空間成本
    }

    /* 
     * 檢查主持人是否更動
     * 有更動→修改
     * 沒更動→不改
     */
    const chair = await ChairSign.find({ confId: confId }).lean() // 從主持人簽核檔中取得主持人的資料

    // 判斷主持人是否改變
    if (chair.chairId !== chairId) { // 主持人有改變
        // 生成主持人簽核檔要修改的資料
        const updateItem = { chairId }

        // 在主持人簽核檔中用 confId 找到這筆資料，並更新
        await ChairSign.updateOne({ confId: confId }, updateItem, (error, data) => { 
            if (error) { // 更新失敗
                return console.log(error)
            }
            // console.log('成功修改主持人：', data)
            successNum++
        })
    }

    /* 
     * 檢查使用空間是否更動
     * 有更動→修改
     * 沒更動→不改
     */
    const roomSign = await RoomSign.find({ confId: confId }).lean() //  從使用空間簽核檔中取得原本的新空間資料

    // 判斷使用空間是否改變
    if (roomSign.roomId !== roomId) { // 新空間有改變

        // 生成使用空間簽核檔要修改的資料
        const updateItem = { roomId: roomId, managerId: roomData.managerId }

        // 在使用空間簽核檔中用 confId 找到這筆會議，並更新
        await RoomSign.updateOne({ confId: confId }, updateItem, (error, data) => { 
            if (error) { // 更新失敗
                return console.log(error)
            }
            // console.log('成功修改地點：', data)
            successNum++
        })
    }


    /* 
     * 檢查參與者是原有的還是新增的
     * 原有的但沒被刪除→更新
     * 新增的→新增
     */

    // 先把會議的所有參與者的 isExist 改為 0
    const updateExist = { isExist: 0 }
    // 從出席人員檔中找到會議的所有參與者，並更新
    await Attendee.updateMany({ confId: confId }, updateExist, (error, data) => {
        if (error) { // 更新失敗
            return console.log(error)
        }
    })

    // 生成出席人員檔的資料
    let attendee

    if (typeof (attendees) === 'string') { // 只有一個參與者

        // 從出席人員檔中尋找這個員工
        const atdData = await Attendee.find({ confId: confId, staffId: attendees })

        if (atdData === []) { // 找不到→代表是新的參與者
            // 生成出席人員檔的資料
            attendee = Attendee({
                confId: confId,
                staffId: attendees,
                attendType: parseInt(attendTypes, 10),
                attendMode: 0,
                isExist: 1
            })
            // 保存出席人員資料
            await attendee.save().then((data) => {
                // console.log(data)
                successNum++

            }).catch((error) => {
                console.log(error)
                return false
            })


        } else { // 找到→是原本就有的參與者

            // 生成要更新的資料
            const updateItem = { attendType: attendTypes, isExist: 1 }

            // 從出席人員檔中找到這筆出席資料，並更新
            await Attendee.updateOne({ confId: confId, staffId: attendees }, updateItem, (error, data) => {
                if (error) { // 更新失敗
                    return console.log(error)
                }
                // console.log('成功更新與會者', data)
                successNum++
            })
        }

    } else { // 多個參與者
        for (let [inedx, item] of attendees.entries()) {

            // console.log(item)

            // 從出席人員檔中尋找這個員工
            const atdData = await Attendee.find({ confId: confId, staffId: item })
            // console.log(atdData)

            if (atdData.length === 0) { // 找不到→代表是新的參與者
                // 生成出席人員檔的資料
                attendee = Attendee({
                    confId: confId,
                    staffId: item,
                    attendType: parseInt(attendTypes[inedx], 10),
                    attendMode: 0,
                    isExist: 1
                })

                // 保存出席人員資料
                await attendee.save().then((data) => {
                    // console.log(`新增成功 ${data}`)
                    successNum++
                }).catch((error) => {
                    console.log(error)
                    return false
                })

            } else { // 找到→是原本就有的參與者

                // 生成要更新的資料
                const updateItem = { attendType: parseInt(attendTypes[inedx], 10), isExist: 1 }

                // 從出席人員檔中找到這筆出席資料，並更新
                await Attendee.updateOne({ confId: confId, staffId: item }, updateItem, (error, data) => {
                    if (error) { // 更新失敗
                        return console.log(error)
                    }
                    // console.log('成功更新與會者', data)
                    successNum++
                })
            }
        }
    }

    // 生成會議主檔要修改的資料
    const confUpdate = { name, topic, startTime, endTime, chairId, roomId, cost }

    // 修改會議主檔的資料
    await Conf.updateOne({ _id: confId }, confUpdate, (error, data) => { 
        if (error) { // 更新失敗
            return console.log(error)
        }
        // console.log('成功更新會議', data)
        successNum++
    })

    // console.log(successNum)

    // 檢查上述的資料庫動作是否都成功
    if (typeof (attendees) === 'string') { // 如果只有一個與會者
        if (successNum === 4) { // successNum 是4->代表都成功
            return true
        } else { // 失敗
            return false // 返回false
        }
    } else { // 如果有多個與會者
        if (successNum === (3 + attendees.length)) { // successNum 是3+出席者的人數 -> 代表都成功
            return true
        } else { // 失敗
            return false // 返回false
        }
    }

}