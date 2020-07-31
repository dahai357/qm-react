import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'

import EventBus from '../service/EventBus'

import Version from '../../../version'

class API {

    static ERROR_API = 'ERROR_API'
    static SUCCESS_API = 'SUCCESS_API'

    apiHost;

    secret;

    constructor() {       
        this.apiHost = Version().api_url;
        this.secret = '~!@#$`1234qwert';        
    }

   
    /** this.apiHost = 'https://api.shenbd.com/client/';
     * 获取授权相关
     * authInfo/takeAccess.php
     */
    getAuthToken() {
        var url = 'authInfo/takeAccess';
        var request = {
            "nonce": "abcdef",
            "deviceType": 1
        }

        return this.post(url, request);
    }

    //"8ec749e9de775b4b6ae77f8c6cf3b7cf"
    wrap(_data) {
        var data = _data || {}
        data["timestamp"] = Math.floor(new Date().getTime() / 1000)
        var keys = Object.keys(data);
        keys.sort();
        var vals = [];
        keys.map(function (k) {
            vals.push(data[k])
        })
        var val = vals.join('');
        var sign = md5(val + this.secret);
        return {
            "data": data,
            "sign": sign,
            "encryptType": 2,
            "responseType": "json",
            "currentVersion" : Version().v_label
        }
    }

    /**
     * 
     * @param {*} url 
     * @param {*} data  
     */
    post(url, data, flag) { 
        var wrap = this.wrap(data);            
        return axios.post(
            this.apiHost + url,
            // 2、将请求数据转换为form-data格式
            qs.stringify(wrap),
            // 3、设置请求头Content-Type
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ).then(resp => {            
            if (resp.status == 200) {
                var result = resp.data;
                if (result.resultCode != 1) {
                    EventBus.emit(API.ERROR_API, result.shortMessage)                   
                }
                else{                       
                    if(flag && flag.sucTip && result.shortMessage!=''){                       
                        EventBus.emit(API.SUCCESS_API, result.shortMessage)
                    }
                }
                if(result.resultCode==10005){
                    EventBus.emit("USER_LOGOUT_TWO")
                    return false
                }
                return result
            }
             else {
                EventBus.emit(API.ERROR_API, resp.statusText)
                return { resultCode: resp.status, longMessage: resp.statusText }
            }
        }).catch(err => {
            // EventBus.emit(API.ERROR_API, err)
            return { resultCode: -101, longMessage: err }
        })
    }

    get(url, data) {
        var wrap = this.wrap(data);
        var params = qs.stringify(wrap)
        return axios.get(
            this.apiHost + url + "?" + params,
            // 3、设置请求头Content-Type
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ).then(resp => {
            if (resp.status == 200) {
                if(resp.data.resultCode==10005){
                    EventBus.emit('USER_LOGOUT_TWO')
                }
                return resp.data
            } else {
                return { resultCode: resp.status, longMessage: resp.statusText }
            }
        }).catch(err => {
            return { resultCode: -101, longMessage: err }
        })
    }
}
var api = new API()
module.exports = api;