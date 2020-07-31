import api from './api'

import { DataBusInstance } from '../service/databus'

import EventBus from '../service/EventBus'

import AlertTip from '../service/alerttip'

class LoginApi {

    alertTip;

    constructor() {
        this.alertTip = new AlertTip();
    }

    login(name, pwd) {
        var self = this;
        return api.getAuthToken().then((result) => {
            var resp = result.responseContent;
            var url = 'user/login';
            var data = {
                key: resp.key,
                sellerName: name,
                password: pwd
            }
            return api.post(url, data);
        }).then(function (loginData) {
            if (loginData.resultCode == 1) {
                var url = 'shopkeeper/count';
                var p = {
                    key: loginData.responseContent.key
                }
                self.alertTip.createSocket(p.key);
                return api.post(url, p).then(function (_res) {
                    var datas = _res.responseContent;
                    Object.assign(loginData.responseContent, datas);
                    return loginData;
                });
            } else {
                return loginData;
            }
        })
    }

    /**
     * 各个菜单的数据
     */
    count() {
        var url = 'shopkeeper/count';
        var p = {
            key: DataBusInstance.getSessionKey().key
        }
        return api.post(url, p);
    }


    /**
     * 退出登录
     */
    logout() {
        var url = 'member/logOut';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key
        }
        return api.post(url, p).then(function (res) {
            if (res.resultCode == 1) {
                // DataBusInstance.setSessionKey(null) 
                if (self.alertTip.Socket) {
                    try {
                        self.alertTip.Socket.close()
                    } catch (e) { }
                }
            }
            return res;
        })
    }




}
var loginApi = new LoginApi()
module.exports = loginApi;