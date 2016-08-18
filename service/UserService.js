var Storage = require('../utils/Storage')
var config = require('../configs/config')
var request = require('../utils/Request')

var storage = {}

storage.saveUser = function (user) {
    return Storage.setItem('user', user)
}


storage.clearUser = function () {
    return Storage.removeItem('user')
}


storage.saveUserInfo = function (userInfo) {
    return Storage.setItem('userInfo', userInfo)
}


storage.getUser = function () {
    return Storage.getItem('user')
}

storage.getUserInfo = function () {
    return Storage.getItem('userInfo')
}

storage.getUserAndUserInfo = function () {
    return Promise.all([
        storage.getUser(),
        storage.getUserInfo()
    ])
        .then(results=> {
            return {
                user: results[0],
                userInfo: results[1]
            }
        })
}


var req = {}


req.Login = function (userinfo) {
    var loginUrl = config.domain + '/Action.ashx?Name=HYD.E3.Business.UserInfoBLL.Login'
    return request.post(loginUrl, userinfo)
        .then(data => {
            console.log(data);
            if (data.data.Login) {
                Storage.setItem('Loginuser', data)
                return data
            }
            throw '用户名或密码错误！'
        });
}

req.GetEmployeeList = function (project) {
    var loginUrl = config.domain + '/Action.ashx?Name=HYD.E3.Business.EmployeeBLL.GetAllEmployee'
    return request.post(loginUrl, project)
        .then(data => {
                return data.data;
        });
}


req.getLoginUserInfo = function (user) {
    var apiUrl = config.domain + config.apiPath

    return request.get(apiUrl + '/user/' + user.loginname)
        .then((data)=>data.data)
        .then(userInfo=> {
            if (userInfo) {
                Storage.setItem('userInfo', userInfo)
                return userInfo
            }
            return Storage.getItem('userInfo')
        })
}


req.getUserInfo = function (userName) {
    var apiUrl = config.domain + config.apiPath

    return request.get(apiUrl + '/user/' + userName)
        .then(data=> {
            if (data.error_msg) {
                throw 'UserNotExist'
            }
            return data
        })
        .then((data)=>data.data)
}


req.checkToken = function (token) {
    var apiUrl = config.domain + config.apiPath + '/accesstoken'
    return request.post(apiUrl, {
        accesstoken: token
    })
        .then(data => {
            if (data.success) {
                data.token = token
                Storage.setItem('user', data)
                return data
            }
            throw 'wrong token'
        })
}

exports.storage = storage
exports.req = req
