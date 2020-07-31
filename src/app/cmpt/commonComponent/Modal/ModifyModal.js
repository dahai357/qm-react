import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
moment.locale('zh-cn');
import { Button, DatePicker} from 'antd';
const { RangePicker } = DatePicker;

import EventBus from '../../../service/EventBus'  

export default class ModifyModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.timestamp = 0;
    }

    onChange(value, dateString) {
        if(value) {
            this.timestamp = new Date(dateString).getTime();
        }else{
            this.timestamp = 0;
        } 
    }

    onOk(value) { 
    }

    onHandle() {
        if (!!!this.timestamp || this.timestamp <= 0) {
            EventBus.emit('ERROR_API', '请输入有效时间')
            return;
        }
        if (this.props.onHandle) {
            this.props.onHandle(this.timestamp)
        }
    }

    render() {
        let { type } = this.props
        return (
            <Modal close={this.props.close} title='修改收货时间' height={'250px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className='colory'>
                        请跟买家沟通后再进行修改。
                    </div>
                    <div className='clear-float clear-float-wrap'>
                        <p className='modal-form-label'>收货时间：</p>
                        {
                            type == 1 ?
                                
                                    <DatePicker
                                        showTime={{ defaultValue: moment('00:00', 'HH:mm'),format: 'HH:mm'}}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="选择时间"
                                        className="width300"
                                        onChange={(v, dt) => { this.onChange(v, dt) }}
                                        showToday={false}
                                        onOk={(v) => { this.onOk(v) }}
                                    />  :
                                <RangePicker
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                    }}
                                    showToday={false}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={(v, dt) => { this.onChange(v, dt) }}
                                    onOk={(v) => { this.onOk(v) }}
                                /> 
                        }

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