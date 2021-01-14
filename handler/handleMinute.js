const Minute = require('../models/schema/minute')

// 上傳檔案
async function uploadMinute(confId, user, file) {
    const fileItem = Minute({
        confId, // 會議id
        staffId: user.staffId, // 上傳者的員工編號
        path: file.destination, // 路徑
        name: file.filename, // 檔名
        isExist: 1
    })

    try {
        // 將檔案保存到會議記錄檔
        await fileItem.save().then((data) => {
            console.log(`成功上傳一個檔案 ${data}`)
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

// 刪除檔案
async function deleteMinute(fileId) {
    const uploadItem = { isExist: 0 }

    try {
        // 將會議記錄檔的 isExist 改為 0
        await Minute.updateOne({ _id: fileId }, uploadItem)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = { uploadMinute, deleteMinute }