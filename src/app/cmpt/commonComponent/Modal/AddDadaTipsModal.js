import React from 'react';
import Modal from './ModalSubject';

import { Button ,Input, InputNumber} from 'antd'

import ZZmage from '../../commonComponent/ZZmage'

import dadaApi from '../../../api/dadaApi'

import { MoneytoFixed} from '../../../service/utils'
import EventBus from '../../../service/EventBus'

export default class AddDadaTipsModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            dadaTipIncrease: '',
            dadatTips:'',
            deliveryFee:'',
            dadatTipsNew:'',
            price: this.props.order.goodsAmount+this.props.order.shippingFee,
            dadaBalance:null
        }
    }

    componentDidMount() { 
       this.getTip('init');   
       this.getDadaInfo();       
    }

    getTip(type,fn){
        var self = this;
        dadaApi.getAddTips(self.props.order.orderId).then(function (res) {
            let  resInfo = res.responseContent;
            if(type=='init'){
                self.setState({
                    dadatTips: resInfo.tips,                
                    deliveryFee: resInfo.deliveryFee,
                    dadatTipsNew: resInfo.tips
                })                
            }else{
                self.setState({
                    dadatTips: resInfo.tips
                })
                fn&&fn(resInfo);
            }            
        })
    }

    getDadaInfo(){
        var self = this;
        dadaApi.getDada().then(function (res) { 
            self.setState({
                dadaBalance:res.responseContent.balance
            })          
        })
    }

    changeTip(e) {  
        var old = this.state.dadatTips;    
        this.setState({
            dadaTipIncrease: e
        }) 
        if( e != undefined){
            this.setState({
                dadatTipsNew: e*100 + old
            }) 
        }else{
            this.setState({
                dadatTipsNew: old
            }) 
        }       
    }

    ok() {         
        var self = this;     
        if (!self.state.dadaTipIncrease) {
            EventBus.emit("ERROR_API", "新增的达达小费最小为0.1");
            return;
        }         
        if(self.state.dadatTipsNew >= self.state.price){
            EventBus.emit("ERROR_API", '小费金额需小于订单金额');           
            return;
        } 
        if( self.state.deliveryFee+self.state.dadatTipsNew > self.state.dadaBalance){
            EventBus.emit("ERROR_API", '账户余额不足，无法增加小费');           
            return;
        }
        self.getTip('tips',function(resInfo){            
            if(resInfo.tips>=self.state.dadatTipsNew){ 
                let money = MoneytoFixed(resInfo.tips),
                errorTxt =  '当前小费是'+money+'元，请重新确认';
                EventBus.emit("ERROR_API", errorTxt);    
                self.setState({
                    dadaTipIncrease: ''
                })    
                return;
            }            
            if (self.props.onHandle) {
                self.props.onHandle(self.state.dadatTipsNew)
            }
        });    
    }

    limitDecimals(value) {
        const reg = /^(\-)*(\d+)\.(\d).*$/;
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
            return ''
        }
    }

    render() {        
        let { dadaTipIncrease, dadatTips, deliveryFee, dadatTipsNew } = this.state;
        let self = this; 
        return (
            <Modal close={self.props.close} title='增加小费' height={'400px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className="form-default">
                        <dl>
                            <dt>订单号：</dt>
                            <dd>{self.props.order.orderSn}</dd>
                        </dl>  
                        <dl>
                            <dt>订单配送费：</dt>
                            <dd>￥{MoneytoFixed(self.props.order.shippingFee)}</dd>
                        </dl> 
                        <dl>
                            <dt>达达运费：</dt>
                            <dd>￥{MoneytoFixed(self.state.deliveryFee)}</dd>
                        </dl>
                        <dl>
                            <dt>当前小费：</dt>
                            <dd>￥{MoneytoFixed(self.state.dadatTips)}</dd>
                        </dl>
                        <dl>
                            <dt>增加小费：</dt>
                            <dd>
                                <InputNumber type="text" className='add-input width300'
                                    min={0}
                                    step={1.00}
                                    formatter={self.limitDecimals}
                                    parser={self.limitDecimals}  placeholder='' value={dadaTipIncrease} onChange={(e) => { self.changeTip(e) }} />
                            </dd>
                        </dl>  
                        <dl>
                            <dt>添加后小费：</dt>
                            <dd className="colory">￥{MoneytoFixed(self.state.dadatTipsNew)}</dd>
                        </dl>                       
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { self.ok() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={self.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}