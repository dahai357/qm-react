import React from 'react';

import StockModal from '../../commonComponent/Modal/AddStock';

import storeWarnApi from '../../../api/storeApi'

import { Button } from 'antd'

import ZZmage from '../../commonComponent/ZZmage'

import EventBus from '../../../service/EventBus'

export default class StockItem extends React.Component {
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
            showModal: false,
            stock: props.stock,
            bool:true
        }
    }

    handleClose = () => {
        this.setState({
            showModal: false
        });
    }

    setBool = (val) => {
        this.setState({
            bool: val
        })
    }

    /**
     * 增加库存
     * @param {*} store 
     */
    openStockModal() {
        this.setState({
            showModal: true
        });
    }

    handleStock(num, type) {
        let self = this;
        let { stock } = this.props;        
        if(self.state.bool){
            self.setBool(false);
            storeWarnApi.addStock(stock.goodsId, num, type).then(function (res) {
                if (res.resultCode == 1) {  
                    self.setState({
                        showModal: false
                    })                
                    var so = setTimeout(() => {
                        clearTimeout(so)
                        EventBus.emit('RELOAD_STOCK_LIST')
                    }, 2000);                    
                }
                self.setBool(true);
            })
        }
    }


    render() {               
        let self = this;
        let { stock, showModal } = self.state; 
        stock = this.props.stock;         
        return (            
            stock.limit ? null :
                <React.Fragment>

                    <div className='stock-table-content' key={stock.goodsId}>
                        <div className='stock-table-content-in'>
                            <div className='stock-table-content-each'>
                                <div className='info-box'>
                                    <div className='pic'>
                                        <ZZmage src={stock.goodsImage} alt="" />
                                    </div>
                                    <div className='detail'>
                                        <div className="tit">{stock.goodsName}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='stock-table-content-each stock-font-center stock-title-width20'>
                                {
                                    stock.goodsAttr && stock.goodsAttr.map(function (r,index) {
                                        return <span key={index}>{ (index==0 ? '':'; ') + r.attrValue}</span>
                                    })
                                }
                            </div>
                            <div className='stock-table-content-each stock-font-center stock-table-content-num stock-title-width15'>{stock.goodsStorage}</div>
                            <div className='stock-table-content-each stock-font-center stock-title-width15'>{stock.goodsStorageAlarm}</div>
                            <div className='stock-table-content-each stock-font-center stock-title-width15'>
                                <Button className='btn-txt-orange stock-table-btn' onClick={() => { self.handleStock(0, 'set') }}>忽略</Button><br />
                                <Button className='stock-table-btn' onClick={() => { self.openStockModal() }}>增补库存</Button>
                            </div>
                        </div>
                    </div>

                    {
                        showModal ? <StockModal close={self.handleClose} stock={stock} onHandle={(num) => { self.handleStock(num, 'add') }} /> : null
                    }                    
                </React.Fragment>

        );

    }
}