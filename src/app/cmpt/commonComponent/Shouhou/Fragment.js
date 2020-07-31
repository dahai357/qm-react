
import React from 'react'
import { Button, TimePicker } from 'antd';
import Utils from '../../../service/utils'
module.exports = {

    getTimeRank(t1) {
        var t = new Date(t1 * 1000);
        var m = t.getMinutes();
        var s = t.getSeconds();
        var st = t.getHours() + ":" + (m < 10 ? ('0' + m) : ('' + m)) + ":" + (s < 10 ? ('0' + s) : ('' + s));
        return st;
    },

    /**
     * 
     * @param  retItem 
     */
    getRefundsTypePanel(retItem) {
        var tpl = '';
        if(retItem.refundType==1){
            tpl = 
            <div className='content-each-left-part1'>
                <div className='delivery-msg part-bd'><div className='fonts20 colorblue fontweightbold'>买家申请退款</div></div>
            </div>
        }else{
            if (retItem.refundShippingType == 0) {
                tpl =
                    <div className='content-each-left-part1'>
                        <div className='delivery-msg part-bd'><div className='fonts20 colorblue fontweightbold'>买家到店退货</div></div>
                    </div>
            } else {
                tpl =
                    <div className='content-each-left-part1'>
                        <div className="address"> 
                            {                                
                                retItem.receiveTime > 0  ?                                   
                                    <div>
                                        <p className="mb0">收货时间</p>
                                        <p className="fonts16">
                                            {
                                                Utils.SingleTimeFormat(retItem.receiveTime)
                                            }
                                        </p>
                                    </div>:null
                            }
                            {
                                (retItem.receiveTime<=0 && retItem.goodsState < 3 && retItem.refundShippingType==1 &&  retItem.sellerState==2 && retItem.shippingOver==0) ? <p>请跟买家协商时间</p> :null
                            }
                            {
                                (retItem.refundShippingType == 1 && retItem.sellerState == 3 && retItem.isPlatformIn == 1 && retItem.refundType == 2 && retItem.goodsState < 3 &&  retItem.platformState == 1 && retItem.receiveTime<=0) ? <p>请跟买家协商时间</p> :null
                            }
                            <p className="mb0 colorg">{retItem.reciverInfo && retItem.reciverInfo.address}</p>
                            <p className="colorg">{retItem.reciverInfo && retItem.reciverInfo.trueName}  {retItem.reciverInfo && (retItem.reciverInfo.mobPhone || retItem.reciverInfo.telPhone)} </p>
                        </div>
                    </div>
            }
        }
        
        return (
            tpl
        )
    },

    /**
     * 【支付方式 0:线下付款;1:微信支付;2:货到付款;3:支付宝支付 4qq支付 5 微信小程序】
     * @param {*} retItem 
     */
    getPaymentTypePanel(retItem) {
        var paymentType = '';
        switch (retItem.paymentType) {
            case 0:
                paymentType =
                    <p className='fonts16 fontweightbold'>线下付款</p>
                break;
            case 2:
                paymentType =
                    <p className='fonts16 fontweightbold'>货到付款</p>
                break;
            case 1:
            case 3:
                paymentType =
                    <p className='fonts16 fontweightbold'>线上付款</p>
                break;
            default: break;
        }


        return { paymentType };
    },

    getRefundsInfoPanel(retItem) {
        var tpl = '';

        return tpl;
    },

    getRefundsState(retItem) {
        var tpl = '';

        return tpl;
    },

    getRefundsOpt(retItem, self) {
        var tpl = [];
        retItem._deliver = retItem._deliver || retItem.deliveryman;        
        if (retItem.shippingOver == 0) {
            if (retItem.sellerState == 2) {
                if (retItem.refundShippingType == 0) { 
                    if (retItem.returnType == 2 && retItem.goodsState < 3) {
                        tpl.push(<Button className='footer-button-white' onClick={() => { self.onGotGoods(retItem, 1) }}>确认收货</Button>)
                    }
                } else if (retItem.refundShippingType == 1) { 
                    if (retItem.returnType == 2 && retItem.goodsState < 3) {
                        if (retItem.refundType == 2) {
                            tpl.push(<Button className='footer-button-white' onClick={() => { self.onGotGoods(retItem, 1) }}>确认收货</Button>)
                        }
                        if (retItem.receiveTime <=0) {
                            tpl.push(<Button className='footer-button-white' onClick={() => { self.onModifyTime(retItem, 1) }}>修改收货时间</Button>)
                        }                        
                        if (retItem._deliver && retItem._deliver.trueName) {
                            tpl.push(<Button className='footer-button-white' onClick={() => { self.onGetDeliveriers(retItem) }}>配送员：{retItem._deliver.trueName}</Button>) 
                        }else{
                            tpl.push(<Button className='footer-button-white' onClick={() => { self.onGetDeliveriers(retItem) }}>选择配送员</Button>)
                        }

                    }
                }
            } else if (retItem.sellerState == 1 && retItem.refundState!=0) { 
                tpl.push(<Button className='footer-button-white' onClick={() => { self.onAgree(retItem, 1) }}>同意</Button>)
                tpl.push(<Button className='footer-button-white' onClick={() => { self.onAgree(retItem, -1) }}>不同意</Button>)
            }
        }
        if ( retItem.sellerState == 3 && retItem.isPlatformIn == 1 && retItem.refundType == 2 && retItem.goodsState < 3 &&  retItem.platformState == 1) {
            tpl.push(<Button className='footer-button-white' onClick={() => { self.onGotGoods(retItem, 1) }}>确认收货</Button>)
            if( retItem.refundShippingType == 1){
                if (retItem.receiveTime <=0) {
                    tpl.push(<Button className='footer-button-white' onClick={() => { self.onModifyTime(retItem, 1) }}>修改收货时间</Button>)
                } 
                if (retItem._deliver && retItem._deliver.trueName) {
                    tpl.push(<Button className='footer-button-white' onClick={() => { self.onGetDeliveriers(retItem) }}>配送员：{retItem._deliver.trueName}</Button>) 
                }else{
                    tpl.push(<Button className='footer-button-white' onClick={() => { self.onGetDeliveriers(retItem) }}>选择配送员</Button>)
                }
            } 
        }
        if (retItem.markRefundButton == 1) {
            tpl.push(<Button className='footer-button-white' onClick={() => { self.markRefundEnd(retItem) }}>标记为已退款</Button>)
        }
        return <React.Fragment>
            {
                tpl.map(function (item) {
                    return item
                })
            } 
        </React.Fragment>;
    }

}