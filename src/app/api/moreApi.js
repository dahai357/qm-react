import api from './api'
import { DataBusInstance } from '../service/databus'
class MoreApi {

    constructor() {

    }

    /**
     * feedback/saveFeedback
     * 意见反馈保存
     */
    saveFeedback(desc,images) {
        var url = 'feedback/saveFeedback';        
        var p = {
            key: DataBusInstance.getSessionKey().key,
            feedbackDescribe: desc           
        }
        if(images.length>0){
            p.images = images;
        }
        return api.post(url, p, {sucTip:true})
    }

    /**
     * shopkeeper/getVersion
     * 获取当前版本
     */
    getVersion(_v) {
        var url = 'shopkeeper/getVersion';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            opSystem: _v
        }
        return api.post(url, p)
    }

    /*
    * 上传图片
    */
   saveImage(image,type){
    var url = 'upload/saveImage';
    var p = {
        key: DataBusInstance.getSessionKey().key,
        image:image,
        type:type
    }    
    return api.post(url, p)
   }


}
var moreApi = new MoreApi()
module.exports = moreApi;