/**
 * 【待付款  10; 已取消 0 ； 已关闭 -1 ； 待接单  20  ； 待收货 （25 /30） ; 已完成 40】 
 * 【0：到店自提 1：商家配送 2：快递配送】
 * 【支付方式 0:线下付款;1:微信支付;2:货到付款;3:支付宝支付 4qq支付 5 微信小程序】
 */
import React from 'react'
import { Button } from 'antd'
import md5 from 'md5'

import { MoneytoFixed, TimeFormat, SingleTimeFormat } from '../../../../service/utils'

import TimeCutDown from '../../../../service/TimeCutDown'
import EventBus from '../../../../service/EventBus'
import Version from '../../../../../../version'

module.exports = {

    /**
     * 配送信息
     */
    getShipingLabel(order) {
        let shipingLable =
            <div class="address">
                <p class="mb0">送达时间</p>
                <p className='fonts16'>{TimeFormat(order.deliveryTime, order.deliveryTimeEnd)}</p>
                <p className="mb0 colorg">{order.reciverInfo.address}</p>
                <p className="colorg">{order.reciverInfo.trueName}  {order.reciverInfo.mobPhone || order.reciverInfo.telPhone} </p>
            </div>;
        if (order.shippingType == 0) {
            shipingLable =
                <div class="delivery-msg part-bd">
                    <p class="mb0">买家自提(自提时间：{SingleTimeFormat(order.deliveryTime)})</p>
                    {
                        (order.orderState == 25 || order.orderState == 30 || order.orderState == 35 || order.orderState == 40) ?
                            <p className='fonts20 colorblue'>取件码：{order.dlyoPickupCode}</p> : null
                    }
                    <p className="mt5">{order.reciverInfo.trueName}  {order.reciverInfo.mobPhone || order.reciverInfo.telPhone} </p>
                </div>
        }
        return shipingLable;
    },

    /**
     * 状态
     */
    getStatusLabel(order) {
        let statusLable = '';
        let statusLable1 = '';
        switch (order.orderState) {
            case 20:
                // if(order.isReceivePayment>0){
                statusLable = "请尽快确认订单"
                statusLable1 = "接单前用户可取消订单"
                //     <div>
                //         <div className="colory"><TimeCutDown startTime={order.serverTime} endTime={order.paymentTime} timeEnd={()=>{master.timeEnd()}}/>后自动关闭</div>
                //     </div>
                //     break;
                // }else{
                //     statusLable =
                //     <div>
                //         <div className="colory"><TimeCutDown startTime={order.serverTime} endTime={order.addTime} timeEnd={()=>{master.timeEnd()}}/>后自动关闭</div>
                //     </div>
                break;
            // }                
            case 10:
                statusLable = '待线上付款'
                break;
            case 25:
            case 30:
                if (order.shippingType == 0) {
                    statusLable = '待到店自提'
                    if (order.orderState == 30) {
                        statusLable = '待确认收货'
                    }
                } else {
                    if (order.shippingStatus == 2) {
                        statusLable = '配送中'
                    } else if (order.shippingStatus == 3) {
                        statusLable = '已送达'
                    } else {
                        statusLable = '待配送'
                    }
                }
                break;
            case 35:
                statusLable = '取消待确认'
                break;
            case 40:
                statusLable = '已完成'
                break;
            case 0:
                statusLable = '已取消'
                break;
            case -1:
                statusLable = '已关闭'
                break;
            default: break;
        }

        return { statusLable, statusLable1 };
    },

    /**
     * 订单配送费用信息
     * @param {*} order 
     */
    getLabelShow(order) {
        let payState = '';
        let payLabelState = '';
        if (order.isReceivePayment > 0) { //已支付
            payState = <div><div className='money-title'>实付金额：</div>
                <div className='money-content'>￥{MoneytoFixed(order.orderAmount)}</div> </div>
            switch (order.paymentType) {
                case 0:
                    payLabelState = <span>线下付款，已核实</span>
                    break;
                case 1:
                case 8:
                    payLabelState = <span>线上付款</span>
                    break;
                case 2:
                    payLabelState = <span>货到付款</span>
                    break;
                case 3:
                    payLabelState = <span>线上付款</span>
                    break;
                default: break;
            }
        } else {//未支付 
            payState = <div className='colory'><div className='money-title'>应收金额：</div>
                <div className='money-content'>￥{MoneytoFixed(order.orderAmount)}</div> </div>
            switch (order.paymentType) {
                case 0:
                    payLabelState = <span className='colory'>线下付款，请核实</span>
                    break;
                case 1:
                    payLabelState = <span>待线上支付</span>
                    payState = <div className='colory'><div className='money-title'>待付金额：</div>
                        <div className='money-content'>￥{MoneytoFixed(order.orderAmount)}</div> </div>
                    break;
                case 2:
                    payLabelState = <span className='colory'>货到付款</span>
                    break;
                case 3:
                    payLabelState = <span>待线上支付</span>
                    payState = <div className='colory'><div className='money-title'>待付金额：</div>
                        <div className='money-content'>￥{MoneytoFixed(order.orderAmount)}</div> </div>
                    break;
                default: break;
            }
        }

        return { payState, payLabelState }
    },

    gotoPrint(order) {
        let site_url = Version().site_url,
            timestamp = Math.floor(new Date().getTime() / 1000),
            secret = '~!@#$`1234qwertasdfgzxcvb',
            sign_arg = md5(order.storeId.toString() + order.orderId.toString() + timestamp.toString() + secret),
            print_url = site_url + '?c=store_receiving&a=order_print&store_id=' + order.storeId + '&order_id=' + order.orderId + '&timestamp=' + timestamp + '&sign=' + sign_arg;
        EventBus.emit('OPEN_URL', print_url);
    },


    /**
     * 店家操作
     */
    getOptLabel(order, master) {
        let opts = [];
        order._deliver = order._deliver || order.deliveryman;
        if (order.orderState == 35) {
            opts.push(<Button className='footer-button-white' onClick={() => { master.handleCancel(order, 1) }}>同意</Button>)
            opts.push(<Button className='footer-button-white' onClick={() => { master.handleCancel(order, -1) }}>不同意</Button>)
        }
        // if(order.allowDadaCancel){
        //     // opts.push(<Button className='footer-button-white'  onClick={() => { master.onCancelDadaOrder() }}>取消达达订单</Button>)

        // }
        if (order.deliveryStatus == 1) {
            if (order.orderState != 0) {
                opts.push(<Button className='footer-button-white' onClick={() => { master.onCancelDadaOrder() }}>取消达达订单</Button>)
                //         // 
            }
        }
        if (order.deliveryStatus == 2) {
            if (order.dadaTime > (Date.parse(new Date()) / 1000) - 900) {
                //     //     //         // 
                opts.push(<Button className='footer-button-white' onClick={() => { master.onCancelDadaOrder() }}>取消达达订单</Button>)
            }
        }
        if (order.allowDadaReSend) {
            opts.push(<Button className='footer-button-white' onClick={() => { master.onDadaReSend() }}>重新发货</Button>)
        }
        if (order.allowDadaReceive) {
            opts.push(<Button className='footer-button-white' onClick={() => { master.onDadaReceive() }}>确认收货</Button>)
        }
        if (order.allowDadaCancelOperate) {
            opts.push(<Button className='footer-button-white' onClick={() => { master.onDadaCancelOperate(order) }}>处理</Button>)
        }
        if (order.orderModifyFlag == 1 && order.orderState != -1) {
            opts.push(<Button className='footer-button-white' onClick={() => { master.onModifyOrder(order) }}>修改订单</Button>)
        }
        if (order.isReceivePayment > 0) { //已支付 
            switch (order.orderState) {
                case 20: //待接单
                    opts.push(<Button className='footer-button-white' onClick={() => { master.handleReceive(order, 1) }}>接单</Button>)
                    opts.push(<Button className='footer-button-white' onClick={() => { master.handleReceive(order, -1) }}>拒单</Button>)
                    break;
                case 25:
                case 30:
                    if (order.shippingType != 0 && order.deliveryType == 0) {
                        if (order._deliver && order._deliver.trueName) {
                            opts.push(<Button className='footer-button-white' onClick={() => { master.onGetDeliveriers(order) }}>配送员：{order._deliver.trueName}</Button>)
                        } else {
                            opts.push(<Button className='footer-button-white' onClick={() => { master.onGetDeliveriers(order) }}>发货</Button>)
                        }
                    }
                    opts.push(<Button className='footer-button-white' onClick={() => { this.gotoPrint(order) }}>打印订单</Button>)
                    break;
                default: break;
            }
        } else {//未支付  
            switch (order.orderState) {
                case 20:
                    opts.push(<Button className='footer-button-white' onClick={() => { master.onModifyPrice(order) }}>修改价格</Button>)
                    opts.push(<Button className='footer-button-white' onClick={() => { master.handleReceive(order, 1) }}>接单</Button>)
                    opts.push(<Button className='footer-button-white' onClick={() => { master.handleReceive(order, -1) }}>拒单</Button>)
                    break;
                case 10:
                    opts.push(<Button className='footer-button-white' onClick={() => { master.onModifyPrice(order) }}>修改价格</Button>)
                    break;
                case 25:
                case 30:
                    opts.push(<Button className='footer-button-white' onClick={() => { master.onModifyPrice(order) }}>修改价格</Button>)
                    opts.push(<Button className='footer-button-white' onClick={() => { master.onReceivePayment(order) }}>确认收款</Button>)
                    if (order.shippingType != 0 && order.deliveryType == 0) {
                        if (order._deliver && order._deliver.trueName) {
                            opts.push(<Button className='footer-button-white' onClick={() => { master.onGetDeliveriers(order) }}>配送员：{order._deliver.trueName}</Button>)
                        } else {
                            opts.push(<Button className='footer-button-white' onClick={() => { master.onGetDeliveriers(order) }}>发货</Button>)
                        }
                    }
                    opts.push(<Button className='footer-button-white' onClick={() => { this.gotoPrint(order) }}>打印订单</Button>)
                    break;
                default:
                    break;
            }
        }
        if (order.shippingType == 0) {
            if (order.orderState == 25) {
                opts.push(<Button className='footer-button-white' onClick={() => { master.onReceiveExtract(order) }}>确认自提</Button>)
            }
        }
        return <React.Fragment>
            {
                opts.map(function (item) {
                    return item
                })
            }
        </React.Fragment>
    }
}