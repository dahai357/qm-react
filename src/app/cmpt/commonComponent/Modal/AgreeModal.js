import React from 'react';
import Modal from './ModalSubject';
import { Button, InputNumber, Checkbox } from 'antd';

import { MoneytoFixed } from '../../../service/utils'

import EventBus from '../../../service/EventBus'

import dadaApi from '../../../api/dadaApi'

export default class AgreeModal extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.state = {           
            reson: '',
            dadaStatus: null,
            dadaTip:''
        }
    } 

    componentDidMount() {  
        this.getDadaConfirm();
    }

    getDadaConfirm(fn){
        let self = this;
        if(self.props.order.deliveryType==1){
            dadaApi.getApplyConfirm(self.props.order.orderId).then(function (res) {             
                if(res.responseContent && res.responseContent.length != 0 ){ 
                    let resContent = res.responseContent;                
                    self.setState({
                        dadaStatus : resContent.status,
                        dadaTip : self.getDadaTip(resContent.status)
                    })
                    fn && fn();
                }
                else if(res.responseContent==""||res.responseContent.length==null||res.responseContent.length==undefined ){
                    self.setState({
                        dadaTip :''
                    })
                }
            })
        }
    }
    
    getDadaTip(status){
        var tip = '非对应订单交易日，退款款项需要进行线下协商打款';
        switch (status){   
            case 0 :
                return tip   
                break;
            case 1 : 
                return '1.当前订单已使用达达发货，目前为未接单状态，确认同意该取消订单的申请后，系统将为您自动取消对应达达订单'+'<br>2.'+tip
                break;
            case 2 :
                return '1.当前订单已使用达达发货，目前为待取货状态，取消订单需扣除2元给骑手作为违约金，确认同意该取消订单的申请后系统将为您自动取消对应达达订单'+'<br>2.'+tip
                break;
            case 3 :
                return '1.当前订单已使用达达发货，目前为待取货状态且已超骑手接单15分钟，无法取消订单，若同意该取消订单的申请则对应产生的达达费用需要由商家自行承担'+'<br>2.'+tip
                break;
            case 4 :
                return '1.当前订单已使用达达发货，目前为配送中状态，无法取消达达订单，若同意该取消订单的申请，则对应生成的达达费用需要由商家自行承担，货物需要商家联系骑手召回'+'<br>2.'+tip
                break;
            case 5 :
                return '当前订单已使用达达发货，目前为妥投异常/骑手发起取消订单的状态，请先对达达订单进行处理'
        }
    }

    onTextChange(e, t) {
        var _val = e.target.value
        if (t == 'r') {
            this.setState({
                reson: _val
            })
        }
    }

    onHandle() {   
        var self = this,
        dadaStatusOld = self.state.dadaStatus; 
        if(self.props.order.deliveryType==1){
            self.getDadaConfirm(function(){
                if( dadaStatusOld !== self.state.dadaStatus){
                    EventBus.emit("ERROR_API", '达达订单状态发生变更，请重新确认操作');
                    return;
                }            
                if (self.props.onHandle) {                
                    self.props.onHandle(self.state.reson)
                }
            }); 
        }else{
            if (self.props.onHandle) {                
                self.props.onHandle(self.state.reson)
            }
        }
    }   

    render() {
        let {
            reson, dadaStatus, dadaTip
        } = this.state;
        let self = this;     
        return (
            <Modal close={self.props.close} title={self.props.title} height={ dadaTip == '' || dadaStatus == 5 || dadaStatus == 0 ? '300px' : '370px'}>
                <div className='modal-content-content modal-content-content-style'> 
                    <div className="form-default">
                        <dl>
                            <dt>备注说明：</dt>
                            <dd><textarea className="width320" name="" id="" cols="40" rows="4" value={reson} onChange={(e) => { self.onTextChange(e, 'r') }}></textarea></dd>
                        </dl>                        
                    </div>                    
                    {  dadaTip == '' ? 
                        <div className="margint10 colory">友情提示：非对应订单交易日，退款款项需要进行线下协商打款</div> :
                        <div className="margint10 colory">
                            {   dadaStatus == 0 ||  dadaStatus == 5 ? 
                                <div>友情提示：{dadaTip} </div> : 
                                <div>
                                    友情提示：<br/>
                                    <div dangerouslySetInnerHTML={{__html:dadaTip}}></div>                                
                                </div> 
                            }
                        </div>                                                                     
                    }                    
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' disabled={ dadaStatus == 5 ? true : false}  onClick={() => { self.onHandle() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={self.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}