import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
import EventBus from '../../../service/EventBus'
import dadaApi from '../../../api/dadaApi'
moment.locale('zh-cn');
import { Button, Radio, DatePicker } from 'antd'; 
const RadioGroup = Radio.Group;

export default class ConfirmDadaOrderModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props; 
        this.state = {
            typeValue:null,
            cancelReason:''
        }      
    }

    componentDidMount() {
        let self = this;  
        dadaApi.getConfirmDadaOrder(self.props.order.orderId).then(function (res) {
            self.setState({
                cancelReason: res.responseContent.cancelReason
            }); 
        })
    }

    typeChange = (e) =>{
        this.setState({
            typeValue: e.target.value
        });  
    }

    onHandle() { 
        let self = this;  
        if(!self.state.typeValue && typeof(self.state.typeValue)!="undefined"  && self.state.typeValue !=0){
            EventBus.emit('ERROR_API', '请选择处理意见')
            return;
        }
        if (this.props.onHandle) {
            this.props.onHandle(self.state.typeValue)
        }
    }

    render() {
        let { typeValue, cancelReason } = this.state;
        let self = this; 
        return (
            <Modal close={this.props.close} title={'处理'} height={ '250px'}>
                <div className='modal-content-content modal-content-content-style'>                   
                    <div className="form-default form-w10em">
                        <dl>
                            <dt>骑手取消订单原因：</dt>
                            <dd>{ cancelReason }</dd>
                        </dl>
                        <dl>
                            <dt>处理意见：</dt>
                            <dd>
                                <Radio.Group className="delivery-type" onChange={self.typeChange} value={self.state.typeValue}>
                                    <Radio value={1} className="marginr20">同意</Radio>
                                    <Radio value={0} >不同意</Radio>        
                                </Radio.Group>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { self.onHandle() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={self.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}