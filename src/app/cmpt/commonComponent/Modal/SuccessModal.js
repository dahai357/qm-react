import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
moment.locale('zh-cn');
import { Button, DatePicker } from 'antd'; 

export default class SuccessModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
    }

    componentDidMount() {
        let self = this;
        var so = setTimeout(function(){
            clearTimeout(so)
            if(self.props.close) {
                self.props.close()
            }
        },3000)
    }
  

    render() {
        return (
            <Modal close={this.props.close} title='提示' height={'200px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='tc marginTop10 fonts16'>
                    { 
                        this.props.tipCon ?  this.props.tipCon : '操作成功' 
                    }
                    </div> 
                </div>
                <div className='modal-content-btn colorg'>
                    3秒后窗口关闭
                </div>
            </Modal>
        );
    }
}