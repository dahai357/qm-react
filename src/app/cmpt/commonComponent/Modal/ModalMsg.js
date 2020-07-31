import React from 'react';
import './ModalMsg.less';
import { Modal, Icon } from 'antd';
export default class ModalMsg extends React.Component {
    handleClose = () => {
        this.props.close();
    }
    render() {
        return (
            <Modal visible={true} footer={null} width={'300px'}  zIndex={1100} mask={false} closable={false}  onCancel={this.props.close} wrapClassName="modal-msg"> 
                <div className='modal-content-content'>
                    { this.props.type == 1 ? <Icon type="check-circle" theme="filled" /> : <Icon type="close-circle" theme="filled" />}
                    <div className="ant-modal-msg-title">{this.props.title}</div>
                </div>
            </Modal>
        );
    }
}