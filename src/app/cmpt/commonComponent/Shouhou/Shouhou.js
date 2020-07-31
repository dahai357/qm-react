import React from 'react';
import IconChenkun from "../../imgs/icon-chenkun.jpg";
import './Shouhou.less';

import Fragment from './Fragment'

import ChooseDistributor from '../Modal/ChooseDistributor'

import AddDistributer from '../Modal/AddDistributer'

import orderApi from '../../../api/orderApi';
import refundsApi from '../../../api/refundsApi';
import RejectRefund from '../Modal/RejectRefund';

import AgreeRefund from '../Modal/AgreeRefund';
import ModifyModal from '../Modal/ModifyModal';
import OkModal from '../Modal/OkModal'
import RefundDetailModal from '../Modal/RefundDetailModal'

import ZZmage from '../../commonComponent/ZZmage'

import { Button } from 'antd';

import { MoneytoFixed,TimeFormatFull, Multiply } from '../../../service/utils'

import EventBus from '../../../service/EventBus'

export default class Shouhou extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            retItem: props.retItem,
            selectMDeliverier: false,
            addMDeliverier: false,
            showRejectModal: false,
            showAgreeModal: false,
            showModifyTimeModal: false,
            selectedDeliverierId:'',
            payDeliverier:0,
            showAskModal: false,
            showRefundDetailModal: false,
            orderId:0,
            successTips:'',
            bool:true
        }
    }

    componentDidMount() {
        EventBus.onSingle('RELOAD_REFUND_' + this.props.retItem.refundId, function (e) {
            var self = this;
            refundsApi.getRefundDetail(this.props.retItem.refundId).then(function (res) {                
                self.setState({
                    retItem: res.responseContent
                })
            })
        }.bind(this))
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
     * 处理选择配送员
     */
    handleSelected = (deliver, val) => {
        let self = this;       
        var _order = Object.assign(this.state.retItem, {
            _deliver: deliver
        })
        if(self.state.bool){
            self.setBool(false);
            orderApi.selectDelivery(_order.refundId, deliver.id, val, 2).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        selectMDeliverier: false,
                        retItem: res.responseContent
                    }); 
                }
                self.setBool(true);
            })
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

    onAgree(retItem, or) {
        if (or == 1) {
            this.setState({
                showAgreeModal: true
            })
        } else if (or == -1) {
            this.setState({
                showRejectModal: true
            })
        }
    }

    onGetDeliveriers(retItem) {
        this.setState({
            selectMDeliverier: true
        })
        if(retItem.deliveryman&&retItem.deliveryman.trueName){
            this.setState({
                selectedDeliverierId:retItem.diliverymanId,
                payDeliverier:MoneytoFixed(retItem.deliveryman.distributionFee)
            })
        }
    }

    /**
     * 确认收货
     * @param {*} retItem 
     */
    onGotGoods(retItem) {
        this.setState({
            showAskModal: true
        })
    }    

    handleGotGoods() {
        this.setState({
            showAskModal: false
        })
        var self = this;        
        if(self.state.bool){
            self.setBool(false);
            refundsApi.confirmReceive(self.state.retItem.refundId, self.state.retItem.goodsState).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        retItem: res.responseContent                    
                    })
                }
                self.setBool(true);
            })
        }
    }

    /**
     * 修改时间
     * @param {*} retItem 
     */
    onModifyTime(retItem) {
        this.setState({
            showModifyTimeModal: true
        })
    }

    handleModifyTime(time) {        
        var d = Math.floor(time / 1000);
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            refundsApi.setReceiveTime(this.state.retItem.refundId, d).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        retItem: res.responseContent,
                        showModifyTimeModal: false                   
                    })
                }
                self.setBool(true);
            })
        }
    }
    /*
    查看退款详情
    */
    onGotRefundDetail(retItem) {
        this.setState({
            showRefundDetailModal: true,
            orderId : retItem.orderId
        })
    }

    /**
     * 
     */
    doReject() {
        this.setState({
            showRejectModal: true
        })
    }

    doAgree() {
        this.setState({
            showAgreeModal: true
        })
    }

    handleReject(info) {
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            refundsApi.refuse(self.state.retItem.refundId, info).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        retItem: res.responseContent,
                        showRejectModal: false
                    })
                }
                self.setBool(true);
            })
        }
    }

    handleAgree(price, info, isGiveUp) {
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            refundsApi.agree(self.state.retItem.refundId, Multiply(price,100), info, isGiveUp).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        retItem: res.responseContent,
                        showAgreeModal: false                    
                    })
                }
                self.setBool(true);
            })
        }
    }

    markRefundEnd() {
        var self = this;
        if(self.state.bool){
            self.setBool(false);
            refundsApi.makeRefund(self.state.retItem.refundId).then(function (res) {
                if (res.resultCode == 1) {
                    self.setState({
                        retItem: res.responseContent                    
                    })
                }
                self.setBool(true);
            })
        }
    }

    render() {
        let self = this;
        let { retItem } = this.state;
        let { paymentType } = Fragment.getPaymentTypePanel(retItem);
        let refundsTypePanel = Fragment.getRefundsTypePanel(retItem);
        let optLabel = Fragment.getRefundsOpt(retItem, this);
        let {
            selectMDeliverier,
            addMDeliverier,
            showRejectModal,
            showAgreeModal,
            showModifyTimeModal,
            selectedDeliverierId,
            payDeliverier,
            showAskModal,
            showRefundDetailModal,
            successTips,
            orderId
        } = this.state;           
        return (
            <React.Fragment>
                <div className='content-each'>
                    <div className='content-each-in'>
                        <div className='content-each-left'>
                            {
                                refundsTypePanel
                            }
                            <div className='content-each-left-part2'>
                                {
                                    paymentType
                                }
                                <div className='money'>
                                    <div className='money-title'>订单金额：</div>
                                    <div className='money-content'>￥{MoneytoFixed(retItem.goodsAmount)}</div>
                                </div>
                                <div className='money'>
                                    <div className='money-title'>服务费：</div>
                                    <div className='money-content'>￥{MoneytoFixed(retItem.shippingFee)}</div>
                                </div>
                                <div className='money'>
                                    <div className='money-title'>优惠：</div>
                                    <div className='money-content'>￥{MoneytoFixed(retItem.couponAmount)}</div>
                                </div>
                                <div className='money'>
                                    <div className='money-title'>实付金额：</div>
                                    <div className='money-content'>￥{MoneytoFixed(retItem.orderAmount)}</div>
                                </div>
                                {
                                 retItem.orderRefundAmount > 0 ?
                                <div className='money'>
                                    <div className='money-title'>已退金额：</div>
                                    <div className='money-content'>￥{MoneytoFixed(retItem.orderRefundAmount)}<Button className="btn-txt-orange" onClick={() => { self.onGotRefundDetail(retItem) }}>查看&raquo;</Button></div>
                                </div>:null 
                                }  
                            </div>
                            <div className='content-each-left-part3 fonts12'>
                                <p>售后单号：{retItem.refundSn}</p>
                                <div class="info-tip-box">
                                    <p class="info-btn-more"><i class="ico-more"></i></p>
                                    <div class="info-tip">
                                        <p>订单号：{retItem.orderSn}</p>
                                        <p>买家：{retItem.buyerName}</p>
                                        <p>下单时间：{TimeFormatFull(retItem.addTime)}</p>
                                        {
                                            retItem.finnshedTime?
                                            <p>完成时间：{TimeFormatFull(retItem.finnshedTime)}</p>:null 
                                        }       
                                        <p>申请时间：{TimeFormatFull(retItem.refundAddTime)}</p>       
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='content-each-right'>
                            <React.Fragment>
                                <div className='each-right-wrap'>
                                    <div className='each-right'>
                                        <div className='each-right-left'>
                                            <ZZmage src={retItem.goodsImage} />
                                        </div>
                                        <div className='each-right-center'>
                                            <div className='eachbook-title fonts14'>{retItem.goodsName}</div>
                                            {
                                                (retItem && retItem.goodsGroup.length > 0) ?
                                                    <div className='eachbook-footer'>
                                                        <span className='colory fontweightbold fonts16'>￥{MoneytoFixed(retItem.goodsPayPrice)}</span>
                                                        {
                                                            retItem.goodsPayPrice === retItem.goodsOriginPrice ? null : <span className="colorg marginl20 td-lt">￥{MoneytoFixed(retItem.goodsOriginPrice)}</span>
                                                        }
                                                    </div>
                                                    :
                                                    <div className='eachbook-footer fonts12 colorg'>
                                                        {
                                                            retItem.goodsAttr.map(function (r, index) {
                                                                return <span key={index}>{(index == 0 ? '' : '; ') + r.attrValue}</span>
                                                            })
                                                        }
                                                    </div>
                                            }

                                        </div>
                                        <div className='each-right-right'>
                                            <div className='eachbook-title-right'>x {retItem.goodsNum}</div>
                                            {
                                                (retItem && retItem.goodsGroup.length > 0) ? null : <div className='eachbook-content-right'>￥{MoneytoFixed(retItem.goodsPrice)}</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    (retItem && retItem.goodsGroup.length > 0) ?
                                        <div className="goods-group">
                                            <div className='dapei'>搭配商品</div>
                                            {
                                                retItem && retItem.goodsGroup.map(function (grp, index) {
                                                    return (
                                                        <div className='each-right'>
                                                            <div className='each-right-left'>
                                                                <ZZmage src={grp.goodsImage} />
                                                            </div>
                                                            <div className='each-right-center'>
                                                                <div className='eachbook-title'>{grp.goodsName}</div>
                                                                <div className='eachbook-footer fonts12 colorg'>
                                                                    {
                                                                        grp.goodsAttr.map(function (r, index) {
                                                                            return <span key={index}>{(index == 0 ? '' : '; ') + r.attrValue}</span>
                                                                        })
                                                                    }
                                                                </div>
                                                                <div className="eachbook-price">
                                                                    <span className="fonts16">
                                                                        ￥{MoneytoFixed(grp.discountPrice)}
                                                                    </span>
                                                                    {
                                                                        grp.discountPrice === grp.goodsPrice ? null : <span className="colorg marginl20 td-lt">
                                                                            ￥{MoneytoFixed(grp.goodsPrice)}
                                                                        </span>
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
                            </React.Fragment>
                            <div className='description-box'>
                                <div className="description-item">
                                    <div className="description-tit">售后类型：</div>
                                    <div className="description-detial">{retItem.refundType == 1 ? '仅退款' : (retItem.refundType == 2 ? '退货退款' : '')}</div>
                                </div>
                                {
                                    retItem.reasonInfo ? <div className="description-item">
                                        <div className="description-tit">售后原因：</div>
                                        <div className="description-detial">{retItem.reasonInfo}</div>
                                    </div> : null
                                }

                                <div className="description-item">
                                    <div className="description-tit">申请金额：</div>
                                    <div className="description-detial">￥{MoneytoFixed(retItem.buyerRefundAmount)}</div>
                                </div>
                                {
                                    (retItem.sellerState == 1 || retItem.sellerState == 3) ? null :
                                        <div className="description-item colory">
                                            <div className="description-tit">同意金额：</div>
                                            <div className="description-detial">￥{MoneytoFixed(retItem.refundAmount)}</div>
                                        </div>
                                }

                                {
                                    retItem.buyerMessage ? <div className="description-item">
                                        <div className="description-tit">买家说明：</div>
                                        <div className="description-detial">{retItem.buyerMessage}</div>
                                    </div> : null
                                }

                                {
                                    retItem.picInfo && retItem.picInfo.length > 0 ?
                                        <div className="description-item">
                                            <div className="description-tit">附&emsp;&emsp;件：</div>
                                            <div className="description-detial">
                                                <div className='additional'>
                                                    {
                                                        retItem.picInfo.map(function (it) {
                                                            return (
                                                                <div className='additional-img'>
                                                                    <ZZmage className='shouhou-fujian' src={it} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div> : null
                                }
                            </div>
                            <div className='description-box'>
                                <div className="description-item">
                                    <div className="description-tit">处理状态：</div>
                                    <div className="description-detial">{retItem.sellerStateName}</div>
                                </div>
                                {
                                    (retItem.sellerState == 1) ? null : (retItem.sellerMessage ?
                                        <div className="description-item">
                                            <div className="description-tit">商家备注：</div>
                                            <div className="description-detial">{retItem.sellerMessage}</div>
                                        </div> : null)

                                }
                                {
                                    retItem.isPlatformIn == 1 ?
                                        <div className="description-item">
                                            <div className="description-tit">平台状态：</div>
                                            <div className="description-detial">{retItem.platformState == 0 ? '待审核' : (retItem.platformState == 1 ? '同意' : '不同意')}</div>
                                        </div> : null
                                }
                                {
                                    (retItem.isPlatformIn == 1) ? (retItem.adminMessage ? <div className="description-item">
                                        <div className="description-tit">平台备注：</div>
                                        <div className="description-detial">{retItem.adminMessage}</div>
                                    </div> : null) : null
                                }
                            </div>
                            <div className='content-each-right-footer'>
                                <div className='content-each-right-footer-root'>
                                    <div className='root-left'>
                                        {/*根据订单状态显示文字*/}
                                        <div className="colorg">
                                            {
                                                retItem.stateName
                                            }
                                        </div>
                                    </div>
                                    <div className='root-right'>
                                        {
                                            optLabel
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    selectMDeliverier ? <ChooseDistributor
                        close={self.handleClose}
                        onSelected={self.handleSelected}
                        onAddDistributer={self.handleAddDistributer}
                        selectedDeliverierId = {selectedDeliverierId}
                        payDeliverier = {payDeliverier}
                        ></ChooseDistributor> : ''
                }
                {
                    addMDeliverier ? <AddDistributer
                        close={self.handleCloseX}
                        onAdded={self.handleAdded}></AddDistributer> : ''
                }
                {
                    showRejectModal ?
                        <RejectRefund
                            title={retItem.refundType == 1 ? '不同意退款' : '不同意退货退款'}
                            close={function () { self.setState({ showRejectModal: false }) }}
                            onHandle={(info) => { self.handleReject(info) }}></RejectRefund> : ''

                }

                {
                    showAgreeModal ?
                        <AgreeRefund
                            title={retItem.refundType == 1 ? '同意退款' : '同意退货退款'}
                            close={function () { self.setState({ showAgreeModal: false }) }}
                            retItem ={retItem}
                            onHandle={(p, info, isGiveUp) => { self.handleAgree(p, info, isGiveUp) }}></AgreeRefund> : ''

                }
                {
                    showModifyTimeModal ?
                        <ModifyModal
                            type={1}
                            close={function () { self.setState({ showModifyTimeModal: false }) }}
                            onHandle={(e) => { self.handleModifyTime(e) }}></ModifyModal> : ''

                }
                {
                    showAskModal ?
                        <OkModal
                            tipCon={'是否确认收货？'}
                            onHandle={() => { self.handleGotGoods() }}
                            close={() => { self.setState({ showAskModal: false }) }}>
                        </OkModal> : null
                }
                {
                    showRefundDetailModal ?
                        <RefundDetailModal  
                            orderId = {orderId}     
                            close={() => { self.setState({ showRefundDetailModal: false }) }}>
                        </RefundDetailModal> : null
                }                
            </React.Fragment >
        );

    }
}