// 選擇檔案後自動上傳
function autoSubmit() {
    $("#uploadMinute").submit();
}

// 前往下載
function clickTh(name, path) {
    window.location.href = `/file/download?file=${name}&path=${path}`
}