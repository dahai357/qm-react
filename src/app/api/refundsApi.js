import api from './api'
import { DataBusInstance } from '../service/databus'

class RefundsApi {

    constructor() {

    }

    /**
     * 退款退货列表
     * 1:待处理 2：待收货 0全部
     */
    getRefunds(page, type, arg) {
        var url = 'shopkeeper/getRefunds';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            type: type || 0,
            pageSize: 10,
            pageIndex: page - 1 || 0
        } 
        if (arg) {
            Object.assign(p, arg);
            if(arg.orderId){
                p.pageSize = 100;         
            } 
        }               
        return api.post(url, p);
    }

    /**
     * 确认收货
     * shopkeeper/confirmReceive
     */
    confirmReceive(refundId, goodsState) {
        var url = 'shopkeeper/confirmReceive';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId,
            goodsState: goodsState
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.getRefundDetail(refundId)
            } else {
                return res
            }
        });
    }

    /**
     * 同意
     * shopkeeper/agree
     */
    agree(refundId, refundAmount, text, isGiveUp) {
        var url = 'shopkeeper/agree';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId,
            refundAmount: refundAmount,
            text: text,
            isGiveUp: isGiveUp
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.getRefundDetail(refundId)
            } else {
                return res
            }
        });
    }

    /**
     * 拒绝
     * shopkeeper/refuse
     */
    refuse(refundId, text) {
        var url = 'shopkeeper/refuse';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId,
            text: text
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {
                return self.getRefundDetail(refundId)
            } else {
                return res
            }
        });
    }

    /**
     * shopkeeper/getRefundDetail
     */

    getRefundDetail(refundId) {
        var url = 'shopkeeper/getRefundDetail';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId
        }
        return api.post(url, p);
    }

    /**
     * 设置收货时间
     * shopkeeper/setReceiveTime
     */
    setReceiveTime(refundId, reciveTime) {
        var url = 'shopkeeper/setReceiveTime';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId,
            receiveTime: reciveTime
        }
        return api.post(url, p).then(function (res) {
            if (res.resultCode == 1) {
                return self.getRefundDetail(refundId)
            } else {
                return res
            }
        });
    }


    makeRefund(refundId) {
        var url = 'shopkeeper/makeRefund';
        var self = this;
        var p = {
            key: DataBusInstance.getSessionKey().key,
            refundId: refundId
        }
        return api.post(url, p, {sucTip:true}).then(function (res) {
            if (res.resultCode == 1) {                
                return self.getRefundDetail(refundId)
            } else {
                return res
            }
        });
    }
}

module.exports = new RefundsApi();