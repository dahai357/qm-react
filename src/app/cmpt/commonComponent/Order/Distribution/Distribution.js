import React from 'react';

import Utils from './fragment';

import { Button } from 'antd';

import orderApi from '../../../../api/orderApi';

import dadaApi from '../../../../api/dadaApi';

import ZZmage from '../../../commonComponent/ZZmage';

import { MoneytoFixed, TimeFormatFull} from '../../../../service/utils';
import { DataBusInstance } from '../../../../service/databus'

import TimeCutDown from '../../../../service/TimeCutDown';
import EventBus from '../../../../service/EventBus';

import RejectModal from '../../Modal/RejectModal';
import AgreeModal from '../../Modal/AgreeModal';
import ReceiveOrderModal from '../../Modal/ReceiveOrderModal';
import SuccessModal from '../../Modal/SuccessModal';
import ModifyOrderModal from '../../Modal/ModifyOrderModal';
import ChooseDistributor from '../../Modal/ChooseDistributor';
import AddDistributer from '../../Modal/AddDistributer';
import ModifyPriceModal from '../../Modal/ModifyPriceModal';
import PrintModal from '../../../more/PrintModal';
import OkModal from '../../Modal/OkModal';
import AddDadaTipsModal from '../../Modal/AddDadaTipsModal';
import CancelDadaOrderModal from '../../Modal/CancelDadaOrderModal';
import ConfirmDadaOrderModal from '../../Modal/ConfirmDadaOrderModal';

export default class Distribution extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        props.order.serverTime = props.serverTime
        this.state = {
            order: props.order,
            selectMDeliverier: false,
            addMDeliverier: false,
            showModifyPriceModal: false,
            showPrintModal: false,
            showAskModal: false,
            showAgreeCancelModal:false,
            showRejectCancelModal:false,
            showModifyOrderModal:false,
            showReceiveOrderModal:false,
            showRejectOrderModal:false,
            showaddDadaTipsModal:false,
            showCancelDadaOrderModal:false,
            showCancelDadaOrderAgainModal:false,
            showDadaReceiveModal:false,
            showConfirmDadaOrderModal:false,
            selectedDeliverierId:'',
            successTips:'',
            payDeliverier:0,
            cancelDadaOrderOverTips:'',
            reDadaFlag:false,
            dadaCancelReason:[],
            showDada: props.showDada || 0 ,            
            dadaDeliveryStatus : props.order.deliveryStatus,
            dadaStatusMesssage:'',
            dadaReasonId:'',
            dadaReason:'',
            bool:true
        }
    }

    componentDidMount() {
        EventBus.onSingle('RELOAD_ORDER_' + this.props.order.orderId, function (e) {
            var self = this;
            orderApi.orderDetail(this.props.order.orderId).then(function (res) {                
                self.setState({
                    order: res.responseContent
                })              
            })
        }.bind(this))        
    }   
    
    componentWillReceiveProps(nextProps){                   
        if(nextProps.order != this.props.order){
            this.setState({
                order: nextProps.order
            }) 
        }
    }

    setBool = (val) => {
        this.setState({
            bool: val
        })
    }

    handleClose = () => {
        this.setState({
            selectMDeliverier: false
        });
    } 

    /**
     * 新增配送员，跳转到选择界面
     */
    handleAdded = () => {
        this.handleCloseX();
    }

    /**
     * 关闭添加对话框，但需要打开选择界面
     */
    handleCloseX = () => {
        this.setState({
            selectMDeliverier: true,
            addMDeliverier: false
        });
    }

    /**
     * 处理发货
     */
    handleSelected = (arg) => {       
        let self = this;       
        if(self.state.bool){
            self.setBool(false);
            if(arg.type=='deliveryman'){
                orderApi.selectDelivery(self.state.order.orderId, arg.deliver.id, arg.val).then(function (res) {
                    if (res.resultCode == 1) {
                        self.setState({
                            selectMDeliverier: false,
                            order: res.responseContent
                        }); 
                    }
                    self.setBool(true);
                })
            }else{
                if(self.state.reDadaFlag){
                    dadaApi.reDadaOrder(self.state.order.orderId,arg.dadaTip).then(function (res) {
                        if (res.resultCode == 1) {
                            self.setState({
                                selectMDeliverier: false,
                                order: res.responseContent
                            });                              
                        }
                        self.setBool(true);
                    }) 
                }else{
                    dadaApi.addDadaOrder(self.state.order.orderId,arg.dadaTip).then(function (res) {
                        if (res.resultCode == 1) {
                            self.setState({
                                selectMDeliverier: false,
                                order: res.responseContent
                            });                              
                        }
                        self.setBool(true);
                    }) 
                }            
            }
        }
    }

    /**
     * 处理对话弹出新增配送员框
     */
    handleAddDistributer = () => {
        this.setState({
            selectMDeliverier: false,
            addMDeliverier: true
        });
    }

    /**
     * 修改价格 1
     */
    onModifyPrice(order) {
        this.setState({
            showModifyPriceModal: true
        })
    }

    handleModifyPrice(p) {
        let self = this;
        let { order } = this.state
        var k = Number(p);
        if (Number.isNaN(k)) {
            return;
        }        
        if(self.state.bool){
            self.setBool(false);
            orderApi.modifyOrderAmount(order.orderId, k * 100).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,
                        showModifyPriceModal: false
                    })
                }
                self.setBool(true);
            })
        }
    }

    /**
     * 打印 1
     */
    onPrint(order) {
        this.setState({
            showPrintModal: true
        })
    }

    handlePrint() {
        
    }

    /**
     * 商家接单操作 1
     */
    handleReceive(order,or) {
        if (or == 1) {
            this.setState({
                showReceiveOrderModal: true
            })
        } else if (or == -1) {
            this.setState({
                showRejectOrderModal: true
            })
        }        
    }

    handleReceiveOrder(){
        var self = this;
        let { order } = this.state;
        self.setState({
            showReceiveOrderModal: false
        })        
        if(self.state.bool){
            self.setBool(false);
            orderApi.orderReceive(order.orderId).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent
                    })
                }
                self.setBool(true);
            })
        }
    }  

    handleRejectOrder(info) {
        var self = this;
        let { order } = this.state;    
        self.setState({
            showRejectOrderModal: false
        })        
        if(self.state.bool){
            self.setBool(false);
            orderApi.refuseOrder(order.orderId,info).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent
                    })
                }
                self.setBool(true);
            })
        }
    }



    /**
     * 获得配送员列表 1
     */
    onGetDeliveriers(order) {
        this.setState({
            selectMDeliverier: true                      
        })
        if(order.deliveryman&&order.deliveryman.trueName){
            this.setState({
                selectedDeliverierId:order.diliverymanId,
                payDeliverier:MoneytoFixed(order.deliveryman.distributionFee)
            })
        }
    }
      /**
     * 确认自提 
     */
    onReceiveExtract(order){
        var self = this
        orderApi.receiveExtract(order.orderId).then(function (res) {
            if (res.resultCode == 1) {
                self.setState({
                    order: res.responseContent
                })
            }
        })
    }

    /**
     * 确认收款 1
     */
    onReceivePayment(order) {
        this.setState({
            showAskModal: true
        })
    }


    handleReceivePayment() {
        this.setState({
            showAskModal: false
        })
        var self = this;
        let { order } = this.state;        
        if(self.state.bool){
            self.setBool(false);
            orderApi.receivePayment(order.orderId).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent
                    })
                }
                self.setBool(true);
            })
        }
    }

    timeEnd() {
        var o = this.state.order;
        o.orderState = -1;
        this.setState({
            order: o
        })
    }

    // 取消待确认
    handleCancel(retItem, or) {
        if (or == 1) {
            this.setState({
                showAgreeCancelModal: true
            })
        } else if (or == -1) {
            this.setState({
                showRejectCancelModal: true
            })
        }
    }

    //同意取消订单
    handleAgree(info) { 
        var self = this;    
        if(self.state.bool){ 
            self.setBool(false);
            orderApi.orderCancel(self.state.order.orderId,1,info).then(function (res) {            
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,
                        showAgreeCancelModal: false
                    })
                }
                self.setBool(true);
            })
        }
    }    

    //不同意取消订单
    handleReject(info) {
        var self = this;
        if(self.state.bool){
            self.setBool(false); 
            orderApi.orderCancel(self.state.order.orderId,0,info).then(function (res) {            
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,                   
                        showRejectCancelModal: false
                    })
                }
                self.setBool(true);
            })
        }
    }

    // 修改订单
    onModifyOrder(order) {
        this.setState({
            showModifyOrderModal: true
        })
    }

    handleModifyOrder(p){
        var self = this;
        var goodsListArg = JSON.stringify(p.goodsListArg);        
        if(self.state.bool){ 
            self.setBool(false);
            orderApi.orderModify(p.orderId,goodsListArg,p.orderAmount*100).then(function (res) {   
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,
                        showModifyOrderModal: false                    
                    })
                }
                self.setBool(true);
            })
        }
    }

    //取消达达订单
    onCancelDadaOrder(){
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            dadaApi.getCancelDadaOrder(self.props.order.orderId).then(function (res) {     
                if(res.resultCode == 1){  
                    if(res.responseContent.reasonList){
                        self.setState({
                            dadaCancelReason: res.responseContent.reasonList,
                            showCancelDadaOrderModal: true,
                            dadaDeliveryStatus: res.responseContent.orderInfo.deliveryStatus
                        }) 
                        if(res.responseContent.tips){
                            self.setState({                        
                                cancelDadaOrderOverTips : res.responseContent.tips                        
                            })
                        }else{
                            self.setState({                        
                                cancelDadaOrderOverTips : ''                        
                            })
                        }
                    }else{
                        self.setState({
                            order: res.responseContent
                        })  
                    }                   
                } 
                self.setBool(true);                   
            })
        }
    }   

    handleCancelDadaOrder(reasonId,reason){
        var self = this;
        var dadaReasonId = reasonId || self.state.dadaReasonId,
        dadaReason = reason || self.state.dadaReason;
        if(reasonId){
            self.setState({
                dadaReasonId : reasonId,
                dadaReason : reason
            })
        }
        if(self.state.bool){
            self.setBool(false);
            dadaApi.cancelDadaOrder(self.props.order.orderId,dadaReasonId,dadaReason,self.state.dadaDeliveryStatus).then(function (res) {   
                if (res.resultCode == 1) {                
                    if(res.responseContent.status==2){
                        self.setState({
                            dadaDeliveryStatus: res.responseContent.status,
                            dadaStatusMesssage: res.responseContent.message,
                            showCancelDadaOrderAgainModal: true,
                            showCancelDadaOrderModal: false
                        })
                    }else{
                        self.setState({
                            order: res.responseContent,
                            showCancelDadaOrderModal: false,
                            showCancelDadaOrderAgainModal: false
                        })                    
                    }               
                }
                self.setBool(true);  
            })
        }
    }

    //达达重新发货
    onDadaReSend(){
        this.setState({
            selectMDeliverier: true,
            reDadaFlag: true                    
        })
    }

    //达达确认收货
    onDadaReceive(){
        this.setState({
            showDadaReceiveModal: true           
        })
    }

    handleDadaReceive(){
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            dadaApi.excconfirmDadaOrder(self.props.order.orderId).then(function (res) {   
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,
                        showDadaReceiveModal: false                               
                    })
                }
                self.setBool(true);  
            })
        }
    }

    //达达增加小费
    onAddDadaTips(){
        this.setState({
            showaddDadaTipsModal : true
        })
    }

    handleAddDadaTips(tips){       
        var self = this;       
        if(self.state.bool){
            self.setBool(false);
            dadaApi.addTips(self.props.order.orderId,tips).then(function (res) {  
                if (res.resultCode == 1 || res.resultCode == 10000) {
                    self.setState({
                        order: res.responseContent,
                        showaddDadaTipsModal: false                    
                    })
                } 
                self.setBool(true);            
            })
        }
    }

    //达达骑手取消订单
    onDadaCancelOperate(){        
        this.setState({
            showConfirmDadaOrderModal : true
        })
    }

    handleDadaCancelOperate(isConfirm){         
        var self = this;     
        if(self.state.bool){ 
            self.setBool(false);
            dadaApi.confirmDadaOrder(self.props.order.orderId,isConfirm).then(function (res) {  
                if (res.resultCode == 1) {
                    self.setState({
                        order: res.responseContent,
                        showConfirmDadaOrderModal: false                   
                    })
                }
                self.setBool(true);    
            })
        }
    }


    render() {
        let self = this;
        let { order } = self.state;
        let { payState, payLabelState } = Utils.getLabelShow(order)
        let optLabel = Utils.getOptLabel(order, self);
        let {statusLable,statusLable1} = Utils.getStatusLabel(order, self);
        let shippingLabel = Utils.getShipingLabel(order);        
        let {
            selectMDeliverier,
            addMDeliverier,
            showModifyPriceModal,
            showPrintModal,
            showAskModal,
            showAgreeCancelModal,
            showRejectCancelModal,
            showModifyOrderModal,
            showReceiveOrderModal,
            showRejectOrderModal,
            showaddDadaTipsModal,
            showCancelDadaOrderModal,
            showCancelDadaOrderAgainModal,
            showDadaReceiveModal,  
            showConfirmDadaOrderModal,          
            selectedDeliverierId,
            successTips,
            payDeliverier,
            cancelDadaOrderOverTips,
            dadaCancelReason,
            showDada,
            dadaDeliveryStatus,
            dadaStatusMesssage
        } = this.state;     
        return (
            <React.Fragment>
                <div className='content-each'>
                    <div className='content-each-in'>
                        <div className='content-each-left'>
                            <div className='content-each-left-part1'>
                                {
                                    (order.shippingCode || order.orComType == 1) ? 
                                    <div className="msg-box">
                                        { order.shippingCode ? <span className="serial-number">#{ order.shippingCode}</span>:null}
                                        { order.orComType == 1 ? <span className="colorg fonts12 marginl10">已打印</span>:null}
                                    </div> : null
                                }                             
                                
                                {shippingLabel}
                            </div>
                            {
                                (order.deliveryman && order.deliveryType == 0) ?
                                    <div className='content-each-left-part2 part-bd'>
                                        <div>配送员：{order.deliveryman.trueName}</div>
                                        <div>配送费：￥{MoneytoFixed(order.deliveryman.distributionFee)}</div>
                                    </div> : null
                            }

                            <div className='content-each-left-part2'>
                                <p className='fonts16'>{payLabelState}</p>
                                <div className='money'>
                                    <div className='money-title'>订单金额：</div>
                                    <div className='money-content'>￥{MoneytoFixed(order.goodsAmount)}</div>
                                </div>
                                <div className='money'>
                                    <div className='money-title'>服务费：</div>
                                    <div className='money-content'>￥{MoneytoFixed(order.shippingFee)}</div>
                                </div>
                                <div className='money'>
                                    <div className='money-title'>优惠：</div>
                                    <div className='money-content'>￥{MoneytoFixed(order.couponAmount)}</div>
                                </div>
                                <div className='money'>
                                    {payState}
                                </div>
                            </div>
                            <div className='content-each-left-part3 fonts12'>
                                <p>订单号：{order.orderSn}</p>
                                <div class="info-tip-box">
                                    <p class="info-btn-more"><i class="ico-more"></i></p>
                                    <div class="info-tip">
                                        <p>买家：{order.buyerName}</p>
                                        <p>下单时间：{TimeFormatFull(order.addTime)}</p>
                                        {
                                            order.sendTime?
                                            <p>发货时间：{TimeFormatFull(order.sendTime)}</p>:null
                                        } 
                                        {
                                            order.orderState == 0 ? 
                                            <p>取消时间：{TimeFormatFull(order.gmtUpdate)}</p> :null
                                        } 
                                        {
                                            order.orderState == -1 ? 
                                            <p>关闭时间：{TimeFormatFull(order.gmtUpdate)}</p> :null
                                        }                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='content-each-right'> 
                        {
                            order.orderGoods && order.orderGoods.map(function (goods) {
                                return ( 
                                    <div className="marginb5">
                                        <div className="each-right-wrap">
                                            <div className='each-right' key={goods.orderId}>
                                                <div className='each-right-left'>
                                                    <ZZmage className='book-img' src={goods.goodsImage} alt=""/>
                                                </div>
                                                <div className='each-right-center'>
                                                    <div className='eachbook-title fonts14'>{goods.goodsName}</div>
                                                    {
                                                        (goods && goods.goodsGroup.length > 0) ?
                                                            <div className='eachbook-footer'>
                                                                <span className='colory fontweightbold fonts16'>￥{MoneytoFixed(goods.goodsPayPrice)}</span>
                                                                {
                                                                    goods.goodsPayPrice===goods.goodsOriginPrice? null: <span className="colorg marginl20 td-lt">￥{MoneytoFixed(goods.goodsOriginPrice)}</span>
                                                                }
                                                                
                                                            </div>
                                                            :
                                                            <div className='eachbook-footer fonts12 colorg'>
                                                                {
                                                                    goods.goodsAttr.map(function (r, index) {
                                                                        return <span key={index}>{(index > 0 ? '; ' : '') + r.attrValue}</span>
                                                                    })
                                                                }

                                                            </div>
                                                    }

                                                </div>
                                                <div className='each-right-right'>
                                                    <div className='eachbook-title-right'>x{goods.goodsNum}</div>
                                                    {
                                                        (goods && goods.goodsGroup.length > 0) ? null : <div className='eachbook-content-right'>￥{MoneytoFixed(goods.goodsPrice)}</div>
                                                    }

                                                </div>
                                            </div>
                                            <div className="refund-stateName-wrap"><div className="refund-stateName colory">{goods.refundStateName}</div></div>
                                        </div>
                                        {
                                            (goods && goods.goodsGroup.length > 0) ?
                                                <div className="goods-group">
                                                    <div className='dapei'>搭配商品</div>
                                                    {
                                                        goods.goodsGroup && goods.goodsGroup.map(function (grp, index) {
                                                            return (
                                                                <div className='each-right'>
                                                                    <div className='each-right-left'>
                                                                        <ZZmage className='book-img' src={grp.goodsImage} alt=""/>
                                                                    </div>
                                                                    <div className='each-right-center'>
                                                                        <div className='eachbook-title fonts14'>{grp.goodsName}</div>
                                                                        <div className='eachbook-footer'>          
                                                                            <div className="fonts12 colorg">
                                                                                {
                                                                                    grp.goodsAttr.map(function (r, index) {
                                                                                        return <span key={index}> {(index == 0 ? '' : ';') + r.attrValue} </span>
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="eachbook-price">
                                                                            <span className="fonts16">￥{MoneytoFixed(grp.discountPrice)}</span>
                                                                            {
                                                                                grp.discountPrice===grp.goodsPrice ? null:  <span className="colorg marginl20 td-lt">￥{MoneytoFixed(grp.goodsPrice)}</span> 
                                                                            }                
                                                                        </div>  
                                                                    </div>
                                                                    <div className='each-right-right'>
                                                                        <div className='eachbook-title-right'>x {grp.num}</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div> : null
                                        }
                                    </div> 
                                )
                            })
                        } 
                        {
                                            (order && order.orderGifts && order.orderGifts.length > 0) ?<div>
                                                <div className="gift-obj">
                                                                <p><span className="gift-title ">使用{order.orderGifts[0].couponTitle}，赠品如下</span></p>
                                                {
                                                    order.orderGifts.map(function(gift,index){
                                                        return (
                                                            
                                                                <div className="gift-item"  key={'gift'+index}>
                                                                    
                                                                    <div className='each-right' key={'giftList'+index}>
                                                                        <div className='each-right-left'>
                                                                            <ZZmage className='book-img' src={gift.goodsImage} alt=""/>
                                                                        </div>
                                                                        <div className='each-right-center'>
                                                                            <div className='eachbook-title title-size'>{gift.goodsName}</div>
                                                                            {
                                                      gift.goodsAttr.map(function (r, index) {
                                                        return <span className="spec" key={index}> {(index == 0 ? '' : ';') + r.attrValue} </span>
                                                    })
                                                                            }
                                                                        </div>
                                                                        <div className='each-right-right'>
                                                                            <div className='eachbook-title-right'>x{gift.goodsNum}</div>
                                                                        </div>
                                                                    </div>
                                                                      
                                                                </div>

                                                        );
                                                    })
                                                }
                                                </div>
                                            </div>:null
                                        }
                        {
                            order.orderMessage ? <div className='description-box'><div className="description-item"><div className="description-tit">买家留言：</div><div className="description-detial">{order.orderMessage}</div></div></div>:null
                        }
                        {
                            (order.showPreDeliveryFee && order.shippingType != 0 && showDada ==1 && DataBusInstance.getSessionKey().isOpenDada==1) ? (
                            <div className='description-box'>
                                <div className="description-item"><div className="description-tit">订单配送费：</div><div className="description-detial">￥{MoneytoFixed(order.shippingFee)}</div></div> 
                                <div className="description-item"><div className="description-tit">达达预计配送费：</div><div className="description-detial">{ order.deliveryFee == 0 ? '暂无': <span>￥{MoneytoFixed(order.deliveryFee)}</span>}<span className="colorg fonts12 marginl10">预计运费仅供参考，实际运费以达达最终产生的费用为准</span></div></div>
                            </div>) :null
                        }
                        {
                            (order.showDeliveryFee) ?  (
                                <div className='description-box'>
                                  <div className="description-item"><div className="description-tit">达达运费：</div><div className="description-detial">{ order.deliveryFee == 0 ? '暂无': <span>￥{MoneytoFixed(order.deliveryFee)}</span>}</div></div>
                                  <div className="description-item"><div className="description-tit">达达小费：</div><div className="description-detial">￥{MoneytoFixed(order.tips)}{ order.allowDadaTips ? <Button className="btn-txt-orange" onClick={() => { self.onAddDadaTips() }}>增加小费 &raquo;</Button> : null }</div></div> 
                                  { order.showDeliveryStatus ? <div className="description-item"><div className="description-tit">达达状态：</div><div className="description-detial">{ order.showDeliveryStatus}</div></div> : null }
                                  { order.showDm ? <div className="description-item"><div className="description-tit">配&ensp;送&ensp;员：</div><div className="description-detial">{ order.dmName}<span className="colorg marginl10">{ order.dmMobile}</span></div></div> : null }
                                  { order.showCancelFrom ? <div className="description-item"><div className="description-tit">取消类型：</div><div className="description-detial">{ order.showCancelFrom }</div></div> : null }
                                  { order.showCancelReason ? <div className="description-item"><div className="description-tit">{ order.deliveryStatus == 9 ? '异常原因：' :  '取消原因：'}</div><div className="description-detial">{ order.showCancelReason}</div></div> : null }
                                  { order.showExpireReason ? <div className="description-item"><div className="description-tit">过期原因：</div><div className="description-detial">{ order.showExpireReason}</div></div> : null } 
                                </div> )  : null 
                        }                    
                        <div className='content-each-right-footer'>
                            <div className='content-each-right-footer-root'>
                                <div className='root-left'>
                                    <div className="colorg">
                                        {statusLable}
                                    </div>
                                    <span className="text-buttom">
                                    {statusLable1}
                                    </span>
                                </div>
                                <div className='root-right marginb14'>
                                    {optLabel}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                {  
                    selectMDeliverier ? <ChooseDistributor
                        close={this.handleClose}
                        order = { order }
                        onSelected={this.handleSelected}
                        onAddDistributer={this.handleAddDistributer}
                        selectedDeliverierId = {selectedDeliverierId}
                        payDeliverier = {payDeliverier}
                        showDada = { showDada}
                        ></ChooseDistributor> : ''
                }
                {
                    addMDeliverier ? <AddDistributer
                        close={this.handleCloseX}
                        onAdded={this.handleAdded}></AddDistributer> : ''
                }
                {
                    showModifyPriceModal ? <ModifyPriceModal
                        price={MoneytoFixed(order.orderAmount)}
                        order = { order }
                        close={function () { self.setState({ showModifyPriceModal: false }) }}
                        onHandle={(p) => { this.handleModifyPrice(p) }}
                    ></ModifyPriceModal> : ''
                }

                {
                    showPrintModal ?
                        <PrintModal close={function () { self.setState({ showPrintModal: false }) }} order={order}
                            onHandle={(p) => { this.handlePrint(p) }} ></PrintModal> : null
                }

                {
                    showAskModal ?
                        <OkModal key={1}
                            tipCon={'是否确认收款？'}
                            onHandle={() => { self.handleReceivePayment()}}
                            close={() => { self.setState({ showAskModal: false }) }}>
                        </OkModal> : null
                }    

                {
                    showRejectCancelModal ?
                        <RejectModal
                            title={'不同意取消订单'}
                            tip ={'友情提示：非对应订单交易日，退款款项需要进行线下协商打款。'}
                            close={function () { self.setState({ showRejectCancelModal: false }) }}
                            onHandle={(info) => { self.handleReject(info) }}></RejectModal> : ''

                }  

                {
                    showAgreeCancelModal ?
                        <AgreeModal
                            title={'同意取消订单'}
                            order = { order }
                            close={function () { self.setState({ showAgreeCancelModal: false }) }}
                            onHandle={(info) => { self.handleAgree(info)}}></AgreeModal> : ''

                }
                {
                    showModifyOrderModal ? 
                    <ModifyOrderModal  orderId = {order.orderId}  onHandleModify ={(p) => { this.handleModifyOrder(p) }}
                    close={() => { self.setState({ showModifyOrderModal: false }) }} ></ModifyOrderModal>:null
                } 
                {
                    showReceiveOrderModal ?
                        <ReceiveOrderModal
                            title={'接单'} orderId = {order.orderId}
                            close={function () { self.setState({ showReceiveOrderModal: false }) }}
                            onHandle={() => { self.handleReceiveOrder()}}></ReceiveOrderModal> : ''
                }  
                {
                    showRejectOrderModal ? 
                        <RejectModal
                            title={'拒单'}
                            tip ={'友情提示：非当日交易的线上支付订单，拒单后金额需要进行线下打款。'}   
                            order = { order }  
                            height = { '350px'}                       
                            close={function () { self.setState({ showRejectOrderModal: false }) }}
                            onHandle={(info) => { self.handleRejectOrder(info) }}></RejectModal> : ''

                }   
                {
                    showaddDadaTipsModal ? 
                    <AddDadaTipsModal order = { order }  onHandle={(tips) => { self.handleAddDadaTips(tips) }} close={()=>{self.setState({showaddDadaTipsModal:false})}} ></AddDadaTipsModal>:null
                } 

                {
                    showCancelDadaOrderModal ?
                    <CancelDadaOrderModal order = { order } dadaCancelReason={ dadaCancelReason } dadaOverTip={ cancelDadaOrderOverTips } onHandle={(reasonId,reason) => { self.handleCancelDadaOrder(reasonId,reason) }}  close={()=>{self.setState({showCancelDadaOrderModal:false})}} ></CancelDadaOrderModal>:null
                }
                {
                    showCancelDadaOrderAgainModal ?
                    <OkModal key={2} height={'250px'} dadaStatusTip={ dadaStatusMesssage } tipCon={ '是否继续取消订单' }  onHandle={() => { self.handleCancelDadaOrder()}}  close={()=>{self.setState({showCancelDadaOrderAgainModal:false})}} ></OkModal>:null
                }
                {
                    showDadaReceiveModal ?
                    <OkModal key={3} title={'确认收货'}  tipCon={'确认收到骑士返还的物品？'}  onHandle={() => { self.handleDadaReceive()}}  close={()=>{self.setState({showDadaReceiveModal:false})}} ></OkModal>:null
                }
                {
                    showConfirmDadaOrderModal ?
                    <ConfirmDadaOrderModal order = { order }  onHandle={(isConfirm) => { self.handleDadaCancelOperate(isConfirm)}}  close={()=>{self.setState({showConfirmDadaOrderModal:false})}} ></ConfirmDadaOrderModal>:null
                }

            </React.Fragment>
        );
    }
}