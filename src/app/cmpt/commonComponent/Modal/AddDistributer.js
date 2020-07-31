import React from 'react';
import Modal from './ModalSubject';
import IconUser from '../../imgs/ava.png';

import { Button ,Input} from 'antd';

import orderApi from '../../../api/orderApi'

import EventBus from '../../../service/EventBus'

export default class AddDistributer extends React.Component {


    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            mobile: '',
            name: ''
        }
    }

    changeText(e, label) {
        var val = e.target.value;
        if (label == 'm') {
            this.setState({
                mobile: val,
            })
        } else if (label == 'n') {
            this.setState({
                name: val,
            })
        }
    }

    onAdded() {
        var mobile = this.state.mobile;
        if(!!!mobile) {
            EventBus.emit('ERROR_API','请输入手机号')
            return;
        }
        var name = this.state.name;
        var self = this;
        orderApi.addDelivery(mobile, name).then(function (res) {
            if (res.resultCode == 1) {
                if (self.props.onAdded) {
                    self.props.onAdded()
                }
            } else {
               
            }
        })

    }
    render() {
        let { mobile, name } = this.state;
        return (
            <Modal close={this.props.close} title='新增配送员'>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='colory'>
                        配送员需先注册成为【我的身边店】用户。
                    </div>
                    <div className='clear-float clear-float-wrap'>
                        <span className='modal-form-label'>手机号码：</span>
                        <Input type="text" className='add-input width300' placeholder='请输入配送员手机号码' value={mobile} onChange={(e) => { this.changeText(e, 'm') }} />
                    </div>
                    <div className='clear-float clear-float-wrap'>
                        <span className='modal-form-label'>姓&emsp;&emsp;名：</span>
                        <Input type="text" className='add-input width300' placeholder='请输入配送员姓名' value={name} onChange={(e) => { this.changeText(e, 'n') }} />
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onAdded() }}>添加</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}