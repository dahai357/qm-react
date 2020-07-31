import { Modal } from 'antd';
import React from 'react'
import { DataBusInstance } from '../../service/databus'
export default class PrintModal extends React.Component {

    constructor(props){
       super(props)           
    }

    loadFinish=(e) =>{      
        const childFrameObj = document.getElementById('calculation');
        var data = this.props.order;
        data.storeLabel =  DataBusInstance.getSessionKey().storeLabel
        childFrameObj.contentWindow.postMessage(data, '*');//window.postMessage 
    }

    doPrint=(e) =>{
        const del = document.getElementById('iframe');  
        if(del){document.body.removeChild(del);}
        const iframe = document.createElement('IFRAME');
        let doc = null;
        let html  = ''
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-730px;top:-1500px;');
        iframe.id = 'iframe';
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write(document.getElementById('calculation').contentWindow.document.body.innerHTML);
        doc.close();       
        iframe.contentWindow.focus();
        iframe.contentWindow.print();        
    } 

    render() {         
        return (
            <Modal
                visible={true}
                centered={true}
                closable={true}
                footer={null}
                width={750}
                wrapClassName={'CustmeModal'}
                onCancel={this.props.close} bodyStyle={{ background: '#f3f7ff', height: '550px', width: '750px', padding: '0' }}>
                <iframe id="calculation" className="xframe"  src={"./public/print_tpl.html"} onLoad={this.loadFinish}/>
                {/* <button className='modal-footer-btn-white printBtn' onClick={this.doPrint}>打印</button> */}
            </Modal>
        )
    }

}