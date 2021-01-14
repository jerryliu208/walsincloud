
# 會議管理系統（最後更新：2020/12/27）

>12/17更新：修改部分程式碼及添加註解


## 功能

- 會議列表
- 新增會議
- 編輯會議
- 刪除會議
- 主持人簽核
- 空間負責人簽核
- 與會模式選擇
- 上傳與下載會議紀錄
- 發送通知

  
## 專案目錄
| 目錄名稱  | 內容 |
| ------------- | ------------- |
| config  | 專案的配置文件  |
| handler  | 邏輯處理  |
| models  | 與資料庫有關的檔案  |
| public  | 靜態資源  |
| route  | 處理路由與請求  |
| upload  | 存放上傳的檔案  |
| util  | 輔助類檔案  |
| views  | 前端模板  |


## 專案依賴套件

```json

"dependencies": {

	"bcryptjs": "^2.4.3",
	
	"body-parser": "^1.19.0",
	
	"connect-flash": "^0.1.1",
	
	"env-cmd": "^10.1.0",
	
	"express": "^4.17.1",
	
	"express-handlebars": "^5.2.0",
	
	"express-session": "^1.17.1",
	
	"moment": "^2.29.1",
	
	"mongoose": "^5.11.8",
	
	"multer": "^1.4.2",
	
	"passport": "^0.4.1",
	
	"passport-local": "^1.0.0"
	
},

"devDependencies": {

	"nodemon": "^2.0.6"

}

```


## 使用方法

1. Clone 此專案至電腦
  
2. 在存放此專案的資料夾打開終端機 

3. 安裝所有專案所需的套件

```
$ [~/walsin-cloud]npm i
```

4. 開啟本地 MongoDB 資料庫 

5. 生成使用者與新空間資料

```
$ [~/walsin-cloud/models/seeder]node seeder.js
```

6. 啟動伺服器，執行 app.js 檔案

```
$ [~/walsin-cloud]npm run start
```

7. 當終端機出現以下訊息時，表示伺服器已成功啟動，且與資料庫成功連結

```
Listening on port 3000
資料庫連線成功！mongodb://localhost/walsin-cloud
```

8. 打開瀏覽器，前往 [http://localhost:3000/](http://localhost:3000/)，登入後即可使用
