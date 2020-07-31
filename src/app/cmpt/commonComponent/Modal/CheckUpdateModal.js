import React from 'react';
import Modal from './ModalSubject';
import moment from 'moment';
moment.locale('zh-cn');
import Version from '../../../../../version'
import EventBus from '../../../service/EventBus'
import { Button, DatePicker } from 'antd';
export default class CheckUpdateModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.req = null;
        this.state = {
            updateProgress: 0
        }
    }

    onHandle() {
        if(Version().v_support =='xp'){
            EventBus.emit('OPEN_URL', Version().site_url);   
            this.props.close();      
        }else{
            this.onHandleDownPackage()
        }              
    }

    onHandleDownPackage() {
        let self = this;
        var req = this.req = new XMLHttpRequest();
        //监听进度事件
        req.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.floor((evt.loaded / evt.total) * 100);                
                if (percentComplete == 100) {
                    //self.props.close()
                }
                self.setState({
                    updateProgress: percentComplete
                })
            }
        }, false);        
        req.open("GET", self.props.updateUrl, true);
        req.responseType = 'blob';
        req.onload = function (e) { download(req.response, "Shenbd_Setup_Lastest.zip"); }
        req.send();         
    }

    componentWillUnmount() {
        if (this.req) {
            this.req.abort();//请求中止
        }
    }

    render() {
        let { updateProgress } = this.state
        return (
            <div>
                <Modal close={this.props.close} title='提示' height={'200px'}>
                    <div className='modal-content-content modal-content-content-style'>
                        <div className='tc marginTop10 fonts16'>
                            {
                                updateProgress <= 0 ? <div>有新的版本，请及时更新！</div> : (updateProgress == 100 ?
                                    <div>下载完成，请前往安装新版本！</div> :
                                    <div>下载进度：{updateProgress + '%'}</div>
                                )
                            }

                        </div>
                    </div>
                    <div className='modal-content-btn'>
                        {
                            updateProgress > 0 ? null :
                                <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onHandle() }}>确定</Button>
                        }
                        <Button className='modal-footer-btn-white' onClick={this.props.close}>
                            {
                                updateProgress == 100 ? '确定' : '取消'
                            }
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}