import React from 'react';
import { Button } from 'antd'; 
import Modal from './ModalSubject';
import refundsApi from '../../../api/refundsApi';
import { MoneytoFixed, TimeFormatFull} from '../../../service/utils'

export default class RefundDetailModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            list:[],
            orderId: this.props.orderId
        }      
    }

    componentDidMount() {        
        this.loadList()
    }

    loadList = () => {
        var self = this;
        refundsApi.getRefunds(1, 0, {orderId:self.state.orderId}).then(function (res) {
            self.setState({
                list: res.responseContent.refundReturns
            })
            
        })
    }

    render() {
        let { list } = this.state;
        let self = this; 
        return (
            <Modal close={this.props.close} title='退款详情' height='100%'>
                <div className='modal-content-content'>
                    <div className=''>
                      {
                        list && list.map(function (goods) {
                            return ( 
                            <div className="content-each marginb5">
                                <div className="each-right-wrap">
                                    <div className='each-right' key={goods.orderId}>
                                        <div className='each-right-left'>
                                            <img className='book-img' src={goods.goodsImage} alt="" />
                                        </div>
                                        <div className='each-right-center'>
                                            <div className='eachbook-title fonts14'>{goods.goodsName}</div>
                                                <div className='eachbook-footer'>
                                                {
                                                    (goods && goods.goodsGroup.length > 0) ? 
                                                        <div>
                                                            <span>￥{MoneytoFixed(goods.goodsPayPrice)}</span>
                                                            {
                                                                goods.goodsPayPrice===goods.goodsOriginPrice ? null: <span className="colorg marginl20 td-lt">￥{MoneytoFixed(goods.goodsOriginPrice)}</span>
                                                            }                                                 
                                                        </div>             
                                                        :
                                                        <div className="fonts12 colorg">
                                                                {
                                                                    goods.goodsAttr.map(function (r, index) {
                                                                        return <span key={index}> {(index == 0 ? '' : ';') + r.attrValue} </span>
                                                                    })
                                                                }
                                                        </div>
                                                        
                                                }
                                                <div className="colory">同意退款金额：￥{MoneytoFixed(goods.refundAmount)}{ (goods.isSucRefund == 0) ? ' (待打款)' : '' }</div> 
                                                </div>
                                        </div>
                                        <div className='each-right-right'>
                                            <div className='eachbook-title-right'>x{goods.goodsNum}</div>
                                            {
                                                (goods && goods.goodsGroup.length > 0) ? null : <div className='eachbook-content-right'>￥{MoneytoFixed(goods.goodsPrice)}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="refund-stateName-wrap">
                                        <div className="refund-stateName">{goods.refundStateName}</div>
                                    </div>
                                </div>
                                {
                                    (goods && goods.goodsGroup.length > 0) ?
                                        <div className="goods-group">
                                            <div className='dapei'>搭配商品</div>
                                                {
                                                    goods.goodsGroup && goods.goodsGroup.map(function (grp, index) {
                                                        return (
                                                            <div className='each-right'>
                                                                <div className='each-right-left'>
                                                                    <img className='book-img' src={grp.goodsImage} alt=""/>
                                                                </div>
                                                                <div className='each-right-center'>
                                                                    <div className='eachbook-title fonts14'>{grp.goodsName}</div>
                                                                    <div className='eachbook-footer'>          
                                                                        <div className="fonts12 colorg">
                                                                            {
                                                                                grp.goodsAttr.map(function (r, index) {
                                                                                    return <span key={index}> {(index == 0 ? '' : ';') + r.attrValue} </span>
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="eachbook-price">
                                                                        <span>￥{MoneytoFixed(grp.discountPrice)}</span>
                                                                        {
                                                                            grp.discountPrice===grp.goodsPrice ? null:  <span className="colorg marginl20 td-lt">￥{MoneytoFixed(grp.goodsPrice)}</span> 
                                                                        }                
                                                                    </div>  
                                                                </div>
                                                                <div className='each-right-right'>
                                                                    <div className='eachbook-title-right'>x {grp.num}</div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                        </div> : null
                                       
                                }
                                <div className="colorg refund-msg">
                                    <p>售后编号：{goods.refundSn}</p>
                                    <p>退款发起时间：{TimeFormatFull(goods.addTime)}</p>
                                    <p>退款同意时间：{TimeFormatFull(goods.sellerTime)}</p>
                                    {
                                        (goods.gmtUpdate) ? <p>退款完成时间：{TimeFormatFull(goods.gmtUpdate)}</p>:null
                                    }
                                </div>
                            </div>                                            
                            )
                        }) 
                      }
                    </div> 
                    
                </div>
                <div className='modal-content-btn'>
                    <Button className='modal-footer-btn ant-btn-orange' onClick={this.props.close}>确认</Button>                     
                </div>
            </Modal>
        );
    }
}