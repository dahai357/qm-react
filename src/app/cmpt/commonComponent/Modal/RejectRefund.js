import React from 'react';
import Modal from './ModalSubject';
import { Button } from 'antd';
import EventBus from '../../../service/EventBus'
export default class RejectRefund extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reson: ''
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
        if (this.state.reson.replace(/(^\s*)|(\s*$)/g, "") === '') {
            EventBus.emit('ERROR_API', '请输入拒绝理由')
            return;
        }

        if (this.props.onHandle) {
            this.props.onHandle(this.state.reson)
        }
    }
    render() {
        let {
            reson
        } = this.state
        return (
            <Modal close={this.props.close} title={this.props.title} height={'300px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='colory marginb10'>
                        友情提示：非对应订单交易日，退款款项需要进行线下协商打款。
                    </div>
                    <div className="form-default">
                        <dl>
                        <dt>拒绝理由：</dt>
                        <dd><textarea name="" id="" className="width320" cols="40" rows="4" value={reson} onChange={(e) => { this.onTextChange(e, 'r') }}></textarea></dd>
                        </dl>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange'  onClick={() => { this.onHandle()}}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}