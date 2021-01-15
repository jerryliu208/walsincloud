// 自定義 handlebars 方法

// 判斷參與身分
function getAttendType(type) {
    if (type === 1) {
        return '出席'
    }
    return type = '列席'
}

// 判斷參與身分
function getAnotherType(type) {
    if (type === 1) {
        return `<option value="2">列席</option>`
    }
    return `<option value="1">出席</option>`
}

// 判斷與會模式
function getAttendMode(mode) {
    switch (mode) {
        case 0:
            return `<span class="badge badge-secondary">待確定</span>`
        case 1:
            return `<span class="badge badge-success">在場</span>`
        case 2:
            return `<span class="badge badge-info">線上</span>`
        case 3:
            return `<span class="badge badge-light">離線</span>`
    }
}

// 判斷審核狀態
function getSign(sign) {
    switch (sign) {
        case 0:
            return `<span class="badge badge-secondary">待審核</span>`
        case 1:
            return `<span class="badge badge-success">審核通過</span>`
        case 2:
            return `<span class="badge badge-danger">駁回</span>`
    }
}

// 判斷是否相同
function equal(a, b, options) {
    if (a == b) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
}

// 判斷主持人是否可以簽核
function allowChairSign(isChairSign, options) {
    if (isChairSign === 0 || isChairSign === 2) {
        return options.fn()
    } else {
        return options.inverse()
    }
}

// 判斷空間負責人是否可以簽核
function allowRoomSign(isChairSign, isRoomSign, options) {
    if (isChairSign === 1 && isRoomSign !== 1) {
        return options.fn()
    } else {
        return options.inverse()
    }
}

///////////////////////每項通知/////////////////////
function whichNoticification(check, mode, confId, name, sender, sendTime, _id) {
    if(check === true){
        switch (mode) {
            case "0":
                return `<tr onclick="tableClick('`+confId+`')" style="color: #c8c8c8;">
                            <td>主持人已簽核會議【`+name+`】</td>
                            <td class="text-center">`+sender+`</td>
                            <td class="text-center">`+sendTime+`</td>
                        </tr>`
            case "1":
                return `<tr onclick="tableClick('`+confId+`')" style="color: #c8c8c8;">
                            <td>會議【`+name+`】附件已上傳</td>
                            <td class="text-center">`+sender+`</td>
                            <td class="text-center">`+sendTime+`</td>
                        </tr>`
        }
    }else{
        switch (mode) {
            case "0":
                return `<tr onclick="noticeTableClick('`+_id+`','`+confId+`')">
                            <td>主持人已簽核會議【`+name+`】</td>
                            <td class="text-center">`+sender+`</td>
                            <td class="text-center">`+sendTime+`</td>
                        </tr>`
            case "1":
                return `<tr onclick="noticeTableClick('`+_id+`','`+confId+`')">
                            <td>會議【`+name+`】附件已上傳</td>
                            <td class="text-center">`+sender+`</td>
                            <td class="text-center">`+sendTime+`</td>
                        </tr>`
        }
    }
}

// 判斷主持人是否可以創建會議
function allowCreatMeeting(isChairSign, isRoomSign, startTime, endTime) {
    var nowTime = new Date()
    var start = new Date(startTime)
    var end = new Date(endTime)
    if ((isChairSign === 1 && isRoomSign === 1)&&(nowTime >= start && nowTime <= end)) {
        return `<button onclick="creatURL()" type="submit" class="btn btn-primary">開始會議</button>`
    }else if(nowTime >= end){
        return `<button onclick="creatURL()" disabled class="btn btn-primary">已過期</button>`
    }
    else {
        return `<button onclick="creatURL()" disabled class="btn btn-primary">待審核中</button>`
    }
}

// //手機//判斷主持人是否可以創建會議
function allowCreatMeetingM(isChairSign, isRoomSign, startTime, endTime) {
    var nowTime = new Date()
    var start = new Date(startTime)
    var end = new Date(endTime)
    if ((isChairSign === 1 && isRoomSign === 1)&&(nowTime >= start && nowTime <= end)) {
        return `<button onclick="creatURL()" type="submit" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">開始會議</button>`
    }else if(nowTime >= end){
        return `<button onclick="creatURL()" disabled class="w3-button w3-round-xlarge w3-blue w3-xxlarge">已過期</button>`
    }
    else {
        return `<button onclick="creatURL()" disabled class="w3-button w3-round-xlarge w3-blue w3-xxlarge">待審核中</button>`
    }
}

// 判斷會議是否可以編輯
function allowEdit(isChairSign, isRoomSign, options) {
    if (((isChairSign === 0 || isChairSign === 2) && isRoomSign === 0) || (isChairSign === 1 && isRoomSign === 2)) {
        return options.fn()
    } else {
        return options.inverse()
    }
}

// 判斷空間以外的項目是否可以編輯
function allowEditOther(isChairSign, isRoomSign, options) {
    // 如果主持人已簽核，但使用空間被駁回 -> 只能編輯使用空間
    if (isChairSign === 1 && isRoomSign === 2) { // 不可編輯
        return options.inverse()
    } else { // 可編輯
        return options.fn()
    }
}

// 判斷是否可以選擇與會模式
function allowChooseMode(isChairSign, isRoomSign, options) {
    if (isChairSign === 1 && isRoomSign === 1) {
        return options.fn()
    } else {
        return options.inverse()
    }
}

// 判斷參與者是否可以加入會議
function allowJoinMeeting(isChairSign, isRoomSign, startTime, endTime, meetingURL) {
    var nowTime = new Date()
    var start = new Date(startTime)
    var end = new Date(endTime)
    if ((isChairSign === 1 && isRoomSign === 1)&&(nowTime >= start && nowTime <= end)&&(meetingURL !== "")) {
        return (`<button onclick="location.href='`+meetingURL+`'" type="button" class="btn btn-primary">加入會議</button>`)
    }else if(isChairSign !== 1 || isRoomSign !== 1){
        return `<button disabled type="button" class="btn btn-primary">尚未簽核</button>`
    }else if((nowTime <= start)||(meetingURL === "")){
        return `<button disabled type="button" class="btn btn-primary">尚未開放</button>`
    }else if(nowTime >= end){
        return `<button disabled type="button" class="btn btn-primary">已過期</button>`
    }else {
        return `<button disabled type="button" class="btn btn-primary">加入會議</button>`
    }
}

// 判斷//手機//參與者是否可以加入會議
function allowJoinMeetingM(isChairSign, isRoomSign, startTime, endTime, meetingURL) {
    var nowTime = new Date()
    var start = new Date(startTime)
    var end = new Date(endTime)
    if ((isChairSign === 1 && isRoomSign === 1)&&(nowTime >= start && nowTime <= end)&&(meetingURL !== undefined)) {
        return (`<button onclick="location.href='`+meetingURL+`'" type="button" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">加入會議</button>`)
    }else if(isChairSign !== 1 || isRoomSign !== 1){
        return `<button disabled type="button" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">尚未簽核</button>`
    }else if((nowTime <= start)||(meetingURL === undefined)){
        return `<button disabled type="button" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">尚未開放</button>`
    }else if(nowTime >= end){
        return `<button disabled type="button" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">已過期</button>`
    }else {
        return `<button disabled type="button" class="w3-button w3-round-xlarge w3-blue w3-xxlarge">加入會議</button>`
    }
}


module.exports = { getAttendType, getAnotherType, getAttendMode, getSign, equal, allowChairSign, allowRoomSign, allowCreatMeeting, allowEdit, allowEditOther, allowChooseMode, allowJoinMeeting, whichNoticification, allowJoinMeetingM, allowCreatMeetingM}