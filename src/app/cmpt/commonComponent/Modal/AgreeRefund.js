import React from 'react';
import Modal from './ModalSubject';
import { Button, InputNumber, Checkbox } from 'antd';

import { MoneytoFixed } from '../../../service/utils'

import EventBus from '../../../service/EventBus'

export default class AgreeRefund extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            val: '',
            reson: '',
            isGiveUp: 0,
            retItem:this.props.retItem
        }
    }

    allIn() {
        var k = MoneytoFixed(this.props.retItem.orderAmount - this.props.retItem.orderRefundAmount)
        this.setState({
            val: k
        })
    }

    onTextChange(e, t) {
        if (t == 'v') {
            var _val = e
            this.setState({
                val: _val
            })
        } else if (t == 'r') {
            var _val = e.target.value
            this.setState({
                reson: _val
            })
        }
    }

    onHandle() {
        var n = Number(this.state.val)
        if (Number.isNaN(n) || '' === this.state.val) {
            EventBus.emit('ERROR_API', '请输入有效金额')
            return;
        }
        if (this.props.title == '同意退款') {
            this.state.isGiveUp = 1
        }
        if (this.props.onHandle) {
            this.props.onHandle(n, this.state.reson, this.state.isGiveUp)
        }
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

    checkBoxChange(e) {
        var checked = e.target.checked;
        this.state.isGiveUp = checked ? 1 : 0;        
    }

    render() {
        let {
            val,
            reson,
            retItem
        } = this.state
        return (
            <Modal close={this.props.close} title={this.props.title} height={ this.props.title == '同意退款' ? '400px' :'450px' }>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='colory marginb10 fonts12'>
                    友情提示：非对应订单交易日，退款款项需要进行线下协商打款
                    </div>
                    <div className="form-default">
                    {
                        this.props.title == '同意退款' ? null :
                            <dl>
                                <dt></dt><dd><Checkbox onChange={(e) => { this.checkBoxChange(e) }}>弃货</Checkbox></dd>
                            </dl>
                    }
                    <dl>
                        <dt>售后编号：</dt>
                        <dd>{this.props.retItem.refundSn}</dd>
                    </dl>
                    <dl>
                        <dt>退款金额：</dt>
                        <dd>                        
                            <InputNumber className="width240" min={0}
                        step={1.00}
                        formatter={this.limitDecimals}
                        parser={this.limitDecimals}
                        value={val} onChange={(e) => { this.onTextChange(e, 'v') }} />
                            <Button className="width80 btn-refund-all" onClick={() => { this.allIn() }}>全额退款</Button>                        
                            <div className="colory fonts12 margint5 lh1-5">退款金额不可大于可退款金额 { MoneytoFixed(this.props.retItem.orderAmount - this.props.retItem.orderRefundAmount) } 元!</div>
                            <div className="colorg fonts12 lh1-5">
                                <span className="marginr10">订单金额：{ MoneytoFixed(this.props.retItem.goodsAmount) }元</span>
                                <span className="marginr10">实付金额：{ MoneytoFixed(this.props.retItem.orderAmount) }元</span>
                                <span>已退金额：{ MoneytoFixed(this.props.retItem.orderRefundAmount) }元</span>
                            </div>
                        </dd>
                    </dl>
                        <dl>
                            <dt>备注说明：</dt>
                            <dd><textarea className="width320" name="" id="" cols="40" rows="4" value={reson} onChange={(e) => { this.onTextChange(e, 'r') }}></textarea></dd> 
                        </dl>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onHandle() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}