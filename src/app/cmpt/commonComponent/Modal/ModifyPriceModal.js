import React from 'react';
import Modal from './ModalSubject';
import { Button, InputNumber, Input } from 'antd';
import EventBus from '../../../service/EventBus'
export default class ModifyPriceModal extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            price: ''
        }
    }

    onHandle() {
        var n = Number(this.state.price)
        if (Number.isNaN(n) || ''=== this.state.price) {
            EventBus.emit('ERROR_API', '请输入有效金额')
            return;
        }
        if (Number.isNaN(n) || 0 === this.state.price) {
            EventBus.emit('ERROR_API', '订单金额必须大于0')
            return;
        } 
        if (this.props.onHandle) {
            this.props.onHandle(n)
        }
    }

    textChange(e) {
        this.setState({
            price: e
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

    render() {
        let { price } = this.state
        return (
            <Modal close={this.props.close} title='修改订单总价' height={'350px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='colory marginb10'>友情提示：请跟买家沟通后再进行修改。</div>
                    <div className="form-default">
                        <dl>
                            <dt>买 家：</dt>
                            <dd>{ this.props.order.buyerName }</dd>
                        </dl>
                        <dl>
                            <dt>订单号：</dt>
                            <dd>{ this.props.order.orderSn } </dd>
                        </dl>
                        <dl>
                            <dt>原订单金额：</dt>
                            <dd><Input type='text' readOnly={true} disabled={true} className='add-input dlg-price-input fonts16' value={'¥ ' + this.props.price} ></Input></dd>
                        </dl>
                        <dl>
                            <dt>调整后价格：</dt>
                            <dd>
                                <InputNumber type='text' min={0} className='add-input width200' value={price} step={1.00} formatter={this.limitDecimals} parser={this.limitDecimals}  onChange={(e) => { this.textChange(e) }}></InputNumber>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={(e) => { this.onHandle() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}