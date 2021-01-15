// 引入套件
const multer = require(`multer`)

// 設定 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // 定義上傳的路徑
        cb(null, '../upload') // 上傳檔案至upload資料夾
    },
    filename: function (req, file, cb) { // 定義檔名
        //cb(null, `${Date.now()}-${file.originalname}`) // 將檔名設為：現在的時間(timestamp格式)-原始檔名
        cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload