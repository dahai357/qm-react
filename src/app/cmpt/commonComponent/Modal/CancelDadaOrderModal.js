import React from 'react';
import Modal from './ModalSubject';
import { Button, Select } from 'antd';
const { Option } = Select;
import EventBus from '../../../service/EventBus'
import dadaApi from '../../../api/dadaApi'

export default class CancelDadaOrderModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reason: '',
            reasonList: this.props.dadaCancelReason,            
            reasonId: 0
        }
    }    

    onTextChange(e) {
        var _val = e.target.value      
        this.setState({
            reason: _val
        })    
    }

    onSelectChange(e){       
        this.setState({
            reasonId:e
        })
    }

    onHandle() {   
        if (this.state.reasonId == 0) {
            EventBus.emit('ERROR_API', '请选择取消原因')
            return;
        }          
        if (this.state.reasonId == 10000 && this.state.reason.replace(/(^\s*)|(\s*$)/g, "") === '') {
            EventBus.emit('ERROR_API', '请输入原因说明')
            return;
        }    
        if (this.props.onHandle) {
            this.props.onHandle(this.state.reasonId,this.state.reason)
        }
    }

    render() {        
        let {
            reason, reasonList
        } = this.state;        
        let self = this; 
        return (
            <Modal close={self.props.close} title={ '取消达达订单'} height={ self.props.dadaOverTip ? '350px' : '300px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='form-default'>
                        <dl>
                            <dt>取消原因：</dt>
                            <dd>
                            <Select placeholder="请选择取消订单原因" style={{ width: 350 }} onChange={(e) => {self.onSelectChange(e)}}> 
                                {   
                                  (reasonList && reasonList.length>0) ?                                 
                                   reasonList.map(function (item) {
                                        return(
                                            <Option key={item.id} value={item.id}>{item.reason}</Option>
                                        )
                                    }) :null
                                }
                            </Select>
                            </dd>
                        </dl>
                        <dl>
                            <dt>原因说明：</dt>
                            <dd>
                                <textarea name="" id="" className="width350" cols="40" rows="4" value={reason} onChange={(e) => { self.onTextChange(e) }}></textarea>
                                {   self.props.dadaOverTip ?  
                                    <div className="colory marginTop10 lh1-5">{ self.props.dadaOverTip }</div> : null 
                                }
                            </dd>
                        </dl>                        
                    </div>                  
                    
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange'  onClick={() => { self.onHandle()}}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={self.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}