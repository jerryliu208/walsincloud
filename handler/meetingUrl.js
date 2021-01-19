const express = require('express')
const Conf = require('../models/schema/conference')

module.exports = async (confId, URL) => {

// 生成會議主檔要修改的資料
const confUpdate = { meetingURL: URL}

// 修改會議主檔的資料
await Conf.updateOne({ _id: confId }, confUpdate, (error, data) => { 
    if (error) { // 更新失敗
        return console.log(error)
    }
     console.log('成功更新會議'+confId, data)
})

}



