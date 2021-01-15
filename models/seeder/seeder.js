const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../schema/user')
const ConfRoom = require('../schema/conferenceRoom')
const confRoomJson = require('./conferenceRoom.json')
const userJson = require('./user.json')

// 添加會員、會議室假資料到資料庫

// mongoose.set('debug', true)
mongoose.connect('mongodb://vincent-db:h2owRYOdiS6afVVcQcNiN6Diw9xSsVgXEWGHtcgexuSI3rNrTyOOfOk8fO4UNi81q2VP2N6FGUOR6673SHU1Jg%3D%3D@vincent-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@vincent-db@', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once('open', () => { // 連線成功
    console.log('資料庫連線成功！ mongodb://localhost/walsin-cloud')
    createUserData() // 添加使用者資料
    createConfRoomData() // 添加會議室資料

}).on('error', (err) => { // 連線失敗
    console.error('connection error', err)
})

// 添加使用者資料
function createUserData() {
    for (let item of userJson) {
        const user = User(item)
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => { // 使用 bcrypt 加密 password
                // console.log(hash) // 加密後的 password
                user.password = hash
                user.isExist = 1
                user.save() // 保存到資料庫
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
        })
    }
}

// 添加會議室資料
function createConfRoomData() {
    for (let item of confRoomJson) {
        const confRoom = ConfRoom(item)
        confRoom.isExist = 1
        confRoom.save() // 保存到資料庫
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }
}