import React from 'react';
import Modal from './ModalSubject';
export default class ModalTextarea extends React.Component{
    render() {
        return (
            <Modal close={this.props.close} title='取消订单'>
                <div className='modal-content-content modal-content-content-style'>
                    <p className='colory'>
                        请谨慎操作，取消订单前请跟买家沟通并经过同意。
                    </p>
                    <div className='clear-float'>
                        <p>取消原因：</p>
                        <textarea name="" id="" cols="40" rows="6"></textarea>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <div className='modal-footer-btn ant-btn-orange'>确定取消订单</div>
                    <div className='modal-footer-btn-white'>点错了，不取消订单</div>
                </div>
            </Modal>
        );
    }
}