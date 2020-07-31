import React from 'react';
import Modal from './ModalSubject';
import { Button } from 'antd';
import orderApi from '../../../api/orderApi';

import EventBus from '../../../service/EventBus'

export default class ReceiveOrderModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {           
            orderId: this.props.orderId,
            buyerName:'',
            isBack: 0,
            orderSn:''
        }
    }     
   
    componentDidMount() {        
        this.loadList()
    }
    
    loadList = () => {
        var self = this;
        orderApi.orderRecieveConfirm(self.state.orderId).then(function (res) {    
            var content = res.responseContent;       
            self.setState({
                buyerName: content.buyerName,
                isBack:content.isBack,
                orderSn:content.orderSn
            }) 
        })
    }

    onHandle() {        
        if (this.props.onHandle) {
            this.props.onHandle()
        }
    }   

    render() {
        let { buyerName,isBack,orderSn } = this.state
        return (
            <Modal close={this.props.close} title={this.props.title} height={'250px'}>
                <div className='modal-content-content modal-content-content-style'> 
                    <div className="form-default">
                        <dl>
                            <dt>买 家：</dt>
                            <dd>{buyerName}</dd>
                        </dl>                    
                        <dl>
                            <dt>订单号：</dt>
                            <dd>{orderSn}</dd>
                        </dl>
                    </div>  
                    {
                        isBack == 1 ? 
                            <div className='colorred marginb10'>该用户为黑名单用户!</div> : null
                    }                 
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onHandle() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}