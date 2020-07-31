import React from 'react';
import './ModalSubject.less';
import { Modal } from 'antd';
export default class ModalSubject extends React.Component {
    handleClose = () => {
        this.props.close();
    }
    render() {
        return (
            <Modal
                visible={true}
                centered={true}
                closable={true}
                footer={null}     
                width={ this.props.width ? this.props.width : '500px'}                        
                onCancel={this.props.close} bodyStyle={{ height: this.props.height ? this.props.height : '320px', width: this.props.width ? this.props.width : '500px', padding: '0' }} >
                <div className='modal-content-header' style={{textAlign:this.props.textAlign?this.props.textAlign:'center',paddingLeft:this.props.paddingLeft?this.props.paddingLeft:'0px'}}>
                    {this.props.title}
                </div>
                {this.props.children}
            </Modal>
            // <div className='modal-body'>
            //     <div className='modal-content'>
            //         <div className='modal-div'>
            //             <div className='modal-content-header'>
            //                 <span className='modal-content-header-close' onClick={this.handleClose}>X</span>
            //                 {this.props.title}
            //             </div>
            //             {this.props.children}
            //         </div>
            //     </div>
            // </div>
        );
    }
}