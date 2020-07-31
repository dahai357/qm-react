import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
moment.locale('zh-cn');
import { Button } from 'antd'; 
import Version from '../../../../../version'
import EventBus from '../../../service/EventBus';

export default class OffLineModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;       
    }

    onReLogin() {         
        if (this.props.onHandle) {
            this.props.onHandle()
        }
    }

    onModifyPassword(){
        let site_url = Version().site_url+'?c=seller_login&a=modify1';
        EventBus.emit('OPEN_URL', site_url);
        if (this.props.close) {
            this.props.close()
        }
    }

    render() {
        return (
            <Modal close={this.props.close} title={'下线通知'} height={ '200px'}>
                <div className='modal-content-content modal-content-content-style'>
                    账号在其他设备登陆，请及时确认是否存在风险！如非本人操作/授权操作，则密码可能泄露，建议前往修改密码。<Button className="btn-txt-blue" onClick={() => { this.onModifyPassword()}}>修改密码 &raquo;</Button>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onReLogin() }}>重新登录</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>退出</Button>
                </div>
            </Modal>
        );
    }
}