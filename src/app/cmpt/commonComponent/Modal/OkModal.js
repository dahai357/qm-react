import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
moment.locale('zh-cn');
import { Button, DatePicker } from 'antd'; 

export default class OkModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;       
    }

    onHandle() { 
        if (this.props.onHandle) {
            this.props.onHandle()
        }
    }

    render() {
        return (
            <Modal close={this.props.close} title={this.props.title ? this.props.title: '提示'} height={ this.props.height? this.props.height : '200px'}>
                <div className='modal-content-content modal-content-content-style'>
                    { 
                        this.props.dadaStatusTip ? 
                        <div className="colory marginTop10">{ this.props.dadaStatusTip }</div>:null
                    }
                    <div className='tc marginTop10 fonts16'>
                        {this.props.tipCon}
                    </div> 
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onHandle() }}>确定</Button>
                    { this.props.hideBtnClose ? null : 
                        <Button className='modal-footer-btn-white' onClick={this.props.close}>{  this.props.dadaStatusTip ? '暂不':'取消'}</Button> 
                    }
                </div>
            </Modal>
        );
    }
}