import React from 'react';
import Modal from './ModalSubject';
import EventBus from '../../../service/EventBus'

import { Button ,Input, InputNumber} from 'antd'

import ZZmage from '../../commonComponent/ZZmage'

export default class AddStock extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            num: null
        }

    }

    changeText(e) {
        this.setState({
            num: e
        })
    }

    ok() {
        if(!this.state.num ){
            EventBus.emit('ERROR_API', '请输入库存数量')
            return;
        }
        if (this.props.onHandle) {
            this.props.onHandle(this.state.num)
        }
    }

    limitDecimals(value) {
        if(!isNaN(parseInt(value))){
            return  parseInt(value)>0 ? parseInt(value) :''
        }else{
            return  '' 
        }       
    }

    render() {
        let { stock } = this.props
        let { num } = this.state
        return (
            <Modal close={this.props.close} title='增补库存' height={'300px'}>
                <div className='modal-content-content modal-content-content-style'>
                    <div className="info-box">
                        <div className="pic">
                            <img className='add-stock-img' src={stock.goodsImage} alt="" />
                        </div>
                        <div className="detail">
                            <div className="tit">{stock.goodsName}</div>
                            <div className="fonts12 colorg margint5">
                                {
                                    stock.goodsAttr && stock.goodsAttr.map(function (r) {
                                        return <span key={r.attrValue}> {r.attrValue + '; '} </span>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='clear-float margint20'>
                        <p className='modal-form-label colorg'>增补库存：</p>
                        <InputNumber type="text" className='add-input width300' min={1} step={1} value={num} formatter={this.limitDecimals}  parser={this.limitDecimals} placeholder='请输入库存数量' onChange={(e) => { this.changeText(e) }} ></InputNumber>
                    </div>
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.ok() }}>确定</Button>
                    <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                </div>
            </Modal>
        );
    }
}