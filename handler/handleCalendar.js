const moment = require('moment')
const ConfRoom = require('../models/schema/conferenceRoom')
const Attendee = require('../models/schema/attendee')
const Conf = require('../models/schema/conference')
const ChairSign = require('../models/schema/chairSign')
const Creater = require('../models/schema/creater')

// 處理首頁(參與的會議)
module.exports =async function handleCalendar(user) {
    // 從出席人員檔中取得自己參與的會議
    const attendConfs = await Attendee.find({ staffId: user.staffId, isExist: 1 }).lean()
    // 從會議主檔中取得自己主持的會議
    const chairConfs = await Conf.find({chairId: user.staffId, isChairSign:1, isExist: 1}).lean()
    const calendarData = []
   /* let userConf*/
    var Answer = ``
    var data = ``
    Answer += `<script>

    document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
  
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2021-01-07',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [`
/*try{*/
    //參與
    for (let conf of attendConfs) {
        let confInfo = await Conf.findOne({ _id: conf.confId}).lean() // 從會議主檔中取得會議的詳細資料
        if(confInfo.isChairSign === 0)
        continue
        // 轉換時間格式
        var TWstartTime = confInfo.startTime//.setHours(confInfo.startTime.getHours()-8)
        var TWendTime = confInfo.endTime//.setHours(confInfo.endTime.getHours()-8)
        TWstartTime = moment(confInfo.startTime).format('YYYY-MM-DD'+"T"+'HH:mm:ss')
        TWendTime = moment(confInfo.endTime).format('YYYY-MM-DD'+"T"+'HH:mm:ss')
        
        data += `{
            title: '參與"`+confInfo.name+`"',
            start: '`+TWstartTime+`',
            end: '`+TWendTime+`'
        },`
    }
    //主持
    for (let conf of chairConfs) {
        let confInfo = await Conf.findOne({ _id: conf._id}).lean() // 從會議主檔中取得會議的詳細資料
        // 轉換時間格式
        console.log(confInfo)
        console.log("測試測試測試")
        var TWstartTime = confInfo.startTime//.setHours(confInfo.startTime.getHours()-8)
        var TWendTime = confInfo.endTime//.setHours(confInfo.endTime.getHours()-8)
        TWstartTime = moment(confInfo.startTime).format('YYYY-MM-DD'+"T"+'HH:mm:ss')
        TWendTime = moment(confInfo.endTime).format('YYYY-MM-DD'+"T"+'HH:mm:ss')
        
        data += `{
            title: '主持"`+confInfo.name+`"',
            start: '`+TWstartTime+`',
            end: '`+TWendTime+`'
        },`
    }
    Answer+=data
    if(data !== ``)
    Answer=Answer.substring(0,Answer.length-1)
    Answer += `]
    });

    calendar.render();
    });

    </script>`
/*}
catch{  
    Answer += `]
});

calendar.render();
});

</script>`
}*/
calendarData.push(Answer)
    // 回傳出席的會議資料
    return calendarData

}
