// 沒登入->導向登入頁
function ensureAuthenticated(req, res, next) {
  // 若使用者已通過驗證(已登入)，則觸發 next()
  if (req.isAuthenticated()) {
    return next()
  }
  // 若使用者尚未通過驗證，則將使用者導向登入頁面
  res.redirect('/users/login')
}

// 有登入->用網址去登入->導向首頁
function notAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = { ensureAuthenticated, notAuthenticated }