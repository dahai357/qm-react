import api from './api'
import { DataBusInstance } from '../service/databus'
import orderApi from './orderApi'

class DadaApi {

    constructor() {

    }

    /**
    * 达达订单列表
    */
    orderList(page, state, arg) {
        var url = 'shopkeeper/dadaOrders';        
        var p = {
            key: DataBusInstance.getSessionKey().key,
            dadaState: state || 0,
            pageSize: 10,
            pageIndex: page - 1 || 0
        } 
        if(arg){
           Object.assign(p,arg);     
        }          
        return api.post(url, p);
    }


    /**
    * 店铺达达配置
    */
    getDada() {
        var url = 'shopkeeper/getDada';  
        var p = {
            key: DataBusInstance.getSessionKey().key
        };        
        return api.post(url, p);
    }
    /**
     * 判断是否接入达达
     * 
     */

    getDadaShop() {
        var url = 'shopkeeper/getDadaShop';  
        var p = {
            key: DataBusInstance.getSessionKey().key
        };        
        return api.post(url, p);
    }


    /**
    * 达达订单重新预发布
    */
    rePreOrder(orderId) {
        var url = 'shopkeeper/rePreOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId:orderId
        }            
        return api.post(url, p);
    }  


    /**
    * 达达订单发布
    */
    addDadaOrder(orderId,tips) {
        var url = 'shopkeeper/addDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            tips: tips*100
        }    
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return orderApi.orderDetail(orderId)
            } else {
                return res
            }
        });
    } 
    

    /**
    * 达达订单重新发布
    */
    reDadaOrder(orderId,tips) {
        var url = 'shopkeeper/reDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            tips: tips*100
        }    
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return orderApi.orderDetail(orderId)
            } else {
                return res
            }
        });
    }


    /**
    * 达达获取订单增加小费
    */
    getAddTips(orderId) {
        var url = 'shopkeeper/getAddTips';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }            
        return api.post(url, p);
    }


    /**
    * 达达订单增加小费
    */
    addTips(orderId,tips) {
        var url = 'shopkeeper/addTips';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            tips: tips
        }            
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1 || res.resultCode == 10000) {
                return orderApi.orderDetail(orderId)
            } else{
                return res
            }
        });
    }

    
    /**
    * 获取商家取消达达订单
    */
    getCancelDadaOrder(orderId) {
        var url = 'shopkeeper/getCancelDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }   
        return api.post(url, p).then(function (res) {
            if (res.resultCode == 10000){
                return orderApi.orderDetail(orderId)
            }else{
                return res
            }
        })         
    }


    /**
    * 确认商家取消达达订单
    */
    cancelDadaOrder(orderId,cancelReasonId,cancelReason,deliveryStatus) {
        var url = 'shopkeeper/cancelDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            cancelReasonId: cancelReasonId,            
            cancelReason: cancelReason,
            deliveryStatus: deliveryStatus
        }            
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1 && res.responseContent.status==1) {                
                return orderApi.orderDetail(orderId)
            }else if( res.resultCode == 10000 ){
                return orderApi.orderDetail(orderId)
            }else {
                return res
            }
        });
    }


    /**
    * 达达异常取消订单确认
    */
    excconfirmDadaOrder(orderId) {
        var url = 'shopkeeper/excconfirmDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }            
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return orderApi.orderDetail(orderId)
            } else {
                return res
            }
        });
    }


     /**
    * 获取达达骑手取消订单
    */
    getConfirmDadaOrder(orderId) {
        var url = 'shopkeeper/getConfirmDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }            
        return api.post(url, p);
    }


    /**
    * 确认达达骑手取消订单
    */
    confirmDadaOrder(orderId,isConfirm) {
        var url = 'shopkeeper/confirmDadaOrder';  
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            isConfirm: isConfirm
        }            
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return orderApi.orderDetail(orderId)
            } else {
                return res
            }
        });
    }


    /**
        * 获取申请取消订单
        */
       getApplyConfirm(orderId) {
            var url = 'shopkeeper/getApplyConfirm';  
            var p = {
                key: DataBusInstance.getSessionKey().key,
                orderId: orderId
            }            
            return api.post(url, p);
        }


    
}

module.exports = new DadaApi();