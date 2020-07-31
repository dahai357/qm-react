import React from 'react';
import {Button, Input, InputNumber} from 'antd'; 
import Modal from './ModalSubject';
import orderApi from '../../../api/orderApi';
import { MoneytoFixed, TimeFormatFull} from '../../../service/utils'
import ModifyOrderGoods from './ModifyOrderGoods';
import EventBus from '../../../service/EventBus';

export default class ModifyOrderModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            goodsList:[],
            order:'',
            orderId: this.props.orderId,
            payState:'', 
            priceTotalNew:'',
            priceShippingNew:'',
            priceReliefNew:'', 
            priceAmountNew:'',
            goodsListArg:[],
            isEdit:false        
        }      
    }

    componentDidMount() {        
        this.loadList()
    }   
    
    getPayState(order){
        var self = this;
        var payState ='';
        if (order.isReceivePayment > 0) {                            
            switch (order.paymentType) {
                case 0:
                payState = '线下付款，已核实'
                    break;
                case 1:
                payState = '线上付款'
                    break;
                case 2:
                payState = '货到付款'
                    break;
                case 3:
                payState = '线上付款'
                    break;
                default: break;
            }
        } else {                                   
            switch(order.paymentType) {
                case 0:
                    payState = '线下付款，请核实'
                    break;
                case 1:
                    payState = '待线上支付'
                    break;
                case 2:
                    payState = '货到付款'
                    break;
                case 3:
                    payState = '待线上支付'
                    break;
                default: break;
            }
        }
        return payState;
    }

    loadList = () => {
        var content, list, goodsItem, listArgNew=[], self = this;
        orderApi.orderDetail(self.state.orderId).then(function (res) {
            content = res.responseContent;
            list = content.orderGoods;
            list.forEach(function(element) {
                goodsItem = {
                    goodsId:element.goodsId,
                    goodsCommonId:(element.goodsGroup.length > 0) ? 0 : element.goodsCommonId,
                    goodsNum:element.goodsNum
                }
                listArgNew.push(goodsItem);
            })
            self.setState({
                order: content,
                goodsList: list,
                payState: self.getPayState(content),                
                priceTotalNew: MoneytoFixed(content.goodsAmount),                
                priceShippingNew: MoneytoFixed(content.shippingFee),
                priceReliefNew: MoneytoFixed(content.couponAmount),
                priceAmountNew: MoneytoFixed(content.orderAmount),
                goodsListArg: listArgNew
            })
        })        
    } 

    updateGoodsNum(obj){
        var goodsId = obj.goodsId,
        list = this.state.goodsList,
        listArg = this.state.goodsListArg;
        list.forEach(function(element) {
            if(element.goodsId == goodsId){
                element.goodsNum = obj.goodsNum;
            }             
        })        
        listArg.forEach(function(element) {
            if(element.goodsId == goodsId){
                element.goodsNum = obj.goodsNum;
            }            
        })  
        this.setState({
            goodsList:list,
            goodsListArg:listArg
        })                  
    }

    resetGoodsNum(obj){        
        var goodsId = obj.goodsId,
        list = this.state.goodsList,
        listArg = this.state.goodsListArg;
        list.forEach(function(element) {
            if(element.goodsId == goodsId){
                element.goodsNum = obj.goodsNumOld;
            }            
        })
        listArg.forEach(function(element) {
            if(element.goodsId == goodsId){
                element.goodsNum = obj.goodsNumOld;
            }            
        })
        this.setState({
            goodsList:list,
            goodsListArg:listArg
        })             
    }
    
    getPrice(goodsObj){       
        var self = this; 
        self.setState({
            isEdit:goodsObj.isEdit
        }) 
        self.updateGoodsNum(goodsObj); 
        var goodsListArgNew = self.state.goodsListArg,
        zeroFlag = false;
        goodsListArgNew.forEach(function(element) {
            if(element.goodsNum!=0){
                zeroFlag = true;
                return false;
            }
        })
        if(zeroFlag){
            var listArgNew = JSON.stringify(self.state.goodsListArg);         
            orderApi.orderGetPrice(self.state.orderId,listArgNew).then(function (res) {    
                if(res.resultCode==1){
                    self.setState({  
                        priceTotalNew: MoneytoFixed(res.responseContent.goodsTotalAmount),
                        priceShippingNew: MoneytoFixed(res.responseContent.shippingFee),
                        priceReliefNew: MoneytoFixed(res.responseContent.reliefAmount),
                        priceAmountNew: MoneytoFixed(res.responseContent.orderAmount)
                    }) 
                }else{            
                    self.resetGoodsNum(goodsObj);  
                    var listArgOld = JSON.stringify(self.state.goodsListArg); 
                    orderApi.orderGetPrice(self.state.orderId,listArgOld).then(function (res) {    
                        self.setState({  
                            priceTotalNew: MoneytoFixed(res.responseContent.goodsTotalAmount),
                            priceShippingNew: MoneytoFixed(res.responseContent.shippingFee),
                            priceReliefNew: MoneytoFixed(res.responseContent.reliefAmount),
                            priceAmountNew: MoneytoFixed(res.responseContent.orderAmount)
                        }) 
                    })
                }            
            })
        }else{
            EventBus.emit('ERROR_API', '商品数量不能全部为0');
            self.resetGoodsNum(goodsObj);  
        }
    }
    
    textChange(e) {
        this.setState({
            priceAmountNew : e
        })
    }

    limitDecimals(value) {
        const reg = /^(\-)*(\d+)\.(\d\d).*$/;
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
            return ''
        }
    }

    modifyOrder(){  
        if(this.state.isEdit){
            EventBus.emit('ERROR_API', '请确定商品数量')
        }else{
            var n = Number(this.state.priceAmountNew),
            p = {
                orderId: this.state.orderId,
                orderAmount: n,
                goodsListArg: this.state.goodsListArg
            };
            if (Number.isNaN(n) || ''=== this.state.priceAmountNew) {
                EventBus.emit('ERROR_API', '请输入有效金额')
                return;
            }  
            if (Number.isNaN(n) || 0 === this.state.priceAmountNew) {
                EventBus.emit('ERROR_API', '订单金额必须大于0')
                return;
            }           
            if (this.props.onHandleModify) {
                this.props.onHandleModify(p)
            }
        }        
    }

    setEdit(isEditVal){
        this.setState({
            isEdit: isEditVal
        })
    }

    render() {
        let self = this; 
        let { goodsList, order, payState, priceTotalNew,  priceShippingNew, priceReliefNew, priceAmountNew } = self.state; 
        return (
            <Modal close={this.props.close} title='修改订单' height='100%' width={700}>
                <div className='modal-content-content'>
                    <div className="colorg fonts12 marginb10">
                        <div className="dib marginr10">订单编号：{order.orderSn}</div>
                        <div className="dib marginr10">订单状态：{payState} </div>
                        <div className="dib marginr10">买家：{order.buyerName}</div>
                        <div className="dib marginr10">下单时间：{TimeFormatFull(order.addTime)}</div>
                    </div>
                    <table className="table-order">
                        <thead>
                            <tr>
                                <th>商品名称</th>
                                <th className="width100">价格</th>
                                <th className="width100">数量</th>
                                <th className="width80">操作</th>
                            </tr>
                        </thead>                                              
                        {  
                            goodsList.map(function (goods) {  
                                return <ModifyOrderGoods key={goods.orderId} goods={goods} onHandle={(goodsObj) => { self.getPrice(goodsObj) }}  onEdit={(isEditVal) => { self.setEdit(isEditVal) }}  />  
                            })
                        }                        
                    </table>  
                    <div className="order-total">
                        <div className="group">
                            <div className="item">原商品总额：¥{MoneytoFixed(order.goodsAmount)}</div>
                            <div className="item">原服务费：¥{MoneytoFixed(order.shippingFee)}</div>
                            <div className="item">原优惠：¥{MoneytoFixed(order.couponAmount)}</div>
                            <div className="item">原应收金额：¥{MoneytoFixed(order.orderAmount)}</div>
                        </div>
                        <div className="group">
                            <div className="item">修改后商品总额：¥{this.state.priceTotalNew}</div>
                            <div className="item">修改后服务费：¥{this.state.priceShippingNew}</div>
                            <div className="item">修改后优惠：¥{this.state.priceReliefNew}</div>
                            <div className="item">修改后应收金额：¥ <InputNumber type="text" min={0} step={1.00}  value={this.state.priceAmountNew} formatter={this.limitDecimals}  parser={this.limitDecimals} className='add-input width100' onChange={(e) => { this.textChange(e) }}  /></div>
                        </div>
                    </div>                 
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={self.modifyOrder.bind(this)}>确认</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>                     
                </div>
            </Modal>
        );
    }
}