import api from './api'
import { DataBusInstance } from '../service/databus'

import refundsApi from './refundsApi'

class OrderApi {

    constructor() {

    }

    /**
     * 店铺订单列表（分页数据）
     * @param {*} page 
     * @param {*} state 
     * @param {*} keyword 
     */
    orderList(page, state, arg) {
        var url = 'shopkeeper/orders';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderState: state || 0,
            pageSize: 10,
            pageIndex: page - 1 || 0
        }
        if (arg) {
            Object.assign(p, arg)
        }
        return api.post(url, p);
    }

    /**
    * 商家接单操作
    */
    orderReceive(orderId) {
        var self = this;
        var url = 'shopkeeper/orderReceive';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }
        return api.post(url, p,{sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        })
    }

    //拒绝接单
    refuseOrder(orderId,message){
        var self = this;
        var url = 'shopkeeper/refuseOrder';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            message: message
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        })
    }
     /**
     * 确认自提
     */
    receiveExtract(orderId){
        var self = this
        var url ='shopkeeper/confirmGetBySelf';
        var p ={
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            console.log(res)
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        })
    }
    /**
     * 确认收款
     */
    receivePayment(orderId) {
        var self = this;
        var url = 'shopkeeper/receivePayment';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        })
    }


    /**
     * 获得配送员列表
     */
    getDeliveriers() {
        var url = 'delivery/getDeliveriers';
        var p = {
            key: DataBusInstance.getSessionKey().key
        }
        return api.post(url, p);
    }

    /**
     * 添加配送员
     */
    addDelivery(memberMobile, trueName) {
        var url = 'delivery/addDelivery';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            memberMobile: memberMobile,
            trueName: trueName
        }
        return api.post(url, p);
    }

    /**
     * 搜索配送员(不使用)
     * @param {*} mobile 
     */
    searchDelivery(mobile) {
        var url = 'delivery/searchDelivery';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            mobile: mobile
        }
        return api.post(url, p);
    }

    /**
     * 选择配送员
     * @param {*} orderId 订单
     * @param {*} id 用户
     * @param {*} distributionFee  费率
     * @param {*} orderType  1 购买 2 退货
     */
    selectDelivery(orderId, id, distributionFee, orderType) {
        var url = 'delivery/selectDelivery';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            id: id,
            distributionFee: distributionFee * 100,
            orderType: orderType || 1
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                if (p.orderType == 1) {
                    return self.orderDetail(orderId)
                } else if (p.orderType == 2) {
                    return refundsApi.getRefundDetail(orderId)
                }
            } else {
                return res
            }
        })
    }

    /**
     * shopkeeper/modifyOrderAmount
     */
    modifyOrderAmount(orderId, p) {
        var self = this;
        var url = 'shopkeeper/modifyOrderAmount';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            orderAmount: p
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        });
    }

    /**
     * shopkeeper/orderDetail
     */

    orderDetail(orderId) {
        var url = 'shopkeeper/orderDetail';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }
        return api.post(url, p);
    }


    orderCancel(orderId,agree,reson) {
        var self = this;
        var url = 'ShopKeeper/applyConfirm';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            isAgree: agree
        }
        if(reson){
            p.promotionInfo = reson;
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {            
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        })
    }

    orderGetPrice(orderId,goodsList) {
        var url = 'shopkeeper/getOrderPrice';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            goodsList: goodsList
        }
        return api.post(url, p);
    }

    orderModify(orderId,goodsList,orderAmount) {
        var self = this;
        var url = 'shopkeeper/modifyOrder';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId,
            goodsList: goodsList,
            orderAmount: orderAmount
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.orderDetail(orderId)
            } else {
                return res
            }
        });
    }
    
    //商家接单前准备数据
    orderRecieveConfirm(orderId){
        var url = 'shopkeeper/orderRecieveConfirm';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            orderId: orderId
        }
        return api.post(url, p)
    }
    
}

module.exports = new OrderApi();