import {Modal } from 'antd';
import React from 'react'
export default class AntModal extends React.Component {

    render() {
        return (
            <Modal
                visible={true}
                centered={true}
                closable={true} 
                footer={null}
                width={470}
                wrapClassName={this.props.wrapClassName?this.props.wrapClassName:'CustmeModal'}
                onCancel={this.props.close} bodyStyle={{background:'#f2f7ff',height: this.props.height ? this.props.height : '300px',width:'470px',padding:'0'}}>
                {this.props.children}
            </Modal>
        )
    }

}