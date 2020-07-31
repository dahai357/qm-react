import React from 'react';
import './StockManage.less';

import storeWarnApi from '../../../api/storeApi'
import StockItem from '../../commonComponent/Stock/StockItem';
import EventBus from '../../../service/EventBus'
import { DataBusInstance } from '../../../service/databus'
import { UpdateMenuNum } from '../../../service/utils';
import {  Pagination } from 'antd'

export default class StockManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList: [],
            total: 0,
            current: 1
        }
    }

    componentDidMount() {                
        EventBus.onSingle('RELOAD_STOCK_LIST', this.reload.bind(this,1))   
        this.reload(1);
    }    

    reload(page) {
        var self = this;
        storeWarnApi.getWarningList(page).then(function (res) {
            var _storeList = res.responseContent.list || [];  
            var _total = res.responseContent.totalCount || 0;          
            self.setState({
                storeList: _storeList,
                total: _total,
                current: page
            })
            EventBus.emit('BACK_TOP');
            UpdateMenuNum('alertCount',_total);
        })
    }

    onChangePage(page, pageSize) {        
        this.setState({
            current: page
        })
        this.reload(page)
    }

    render() {
        let self = this;
        let { storeList, current, total } = self.state;
        return (
            <React.Fragment>
                {
                    (storeList && storeList.length > 0) ?
                        <div>                            
                            <div className='stock-table-header'>
                                <div className='stock-table-header-in'>
                                    <div className='stock-table-title'>商品名称</div>
                                    <div className='stock-table-title stock-font-center stock-title-width20'>规格</div>
                                    <div className='stock-table-title stock-font-center stock-title-width15'>库存数量</div>
                                    <div className='stock-table-title stock-font-center stock-title-width15'>库存预警值</div>
                                    <div className='stock-table-title stock-font-center stock-title-width15'>操作</div>
                                </div>
                            </div>
                            {                               
                                storeList && storeList.map(function (res) {
                                    return (
                                        <StockItem stock={res} key={res.goodsId}></StockItem>
                                    )
                                })
                            }
                            <div className="pagination-wrap">                                                                  
                                <Pagination className="pagination-main" defaultPageSize={15} current={current} total={total} onChange={(page, pageSize) => { self.onChangePage(page, pageSize) }} />
                            </div>
                        </div> : <div className="nodata">暂无数据</div>
                }
            </React.Fragment>

        );
    }
}