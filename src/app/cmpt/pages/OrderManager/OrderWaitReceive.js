import React from 'react'
import Distribution from '../../commonComponent/Order/Distribution/Distribution'
import BaseCmpt from '../../../cmpt/basecmpt'
import orderApi from '../../../api/orderApi'

import EventBus from '../../../service/EventBus'
import FilterBar from '../../commonComponent/Common/FilterBar';
import { UpdateMenuNum } from '../../../service/utils';

import { Pagination } from 'antd'

export default class OrderWaitReceive extends BaseCmpt {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            total: 0,
            current: 1,
            tip: false,
            arg:'',
            showDada: ''
        }
    }

    componentDidMount() {
        this.loadData(1);
        EventBus.onSingle('NEW_ORDER_TIP', (msg)=>{
        this.showTip(msg)
        })
    }

    showTip(msg) {
        if(msg){
            EventBus.emit('PLAY_AUDIO_ORDER')
        }else{
            EventBus.emit('PLAY_AUDIO')
        }
        this.setState({
            tip: true
        })
    }

    loadData(page,arg,noUpdateFlag) {
        var self = this;
        orderApi.orderList(page, 20, arg).then(function (res) {
            var _orders = res.responseContent.orders || [];
            var _total = res.responseContent.totalCount || 0;
            var _servTime = res.responseTime || Math.floor(new Date().getTime() / 1000)
            self.setState({
                orders: _orders,
                total: _total,
                tip: false,
                serverTime: _servTime,
                showDada: res.responseContent.showDada
            })
            EventBus.emit('BACK_TOP');
            if(!noUpdateFlag){
                UpdateMenuNum('waitReceiveCount',_total);
            }
        })
    }

    onChangePage(page, pageSize) {
        this.setState({
            current: page
        })
        this.loadData(page,this.state.arg)  
    }

    onChangeFliter(p){
        var self = this;       
        self.loadData(1,p,true); 
        self.setState({
            arg:p,
            current: 1
        })     
    }

    render() {
        let { orders, total, current, tip, serverTime, showDada} = this.state;
        return (
            <React.Fragment>
                <FilterBar orderFlag={false} printFlag={false} dateRangeFlag={false} onHandle={(p) => { this.onChangeFliter(p) }}></FilterBar>
                {
                    tip ? <div className="search-wrap content-each alert-tip" onClick={() => { this.loadData(1) }}>
                        <div className="centre-wrap"> 您有新的订单，点击刷新 </div>

                    </div> : null
                }

                {
                    orders.map(function (order) {
                        return <Distribution key={order.orderId} order={order} serverTime={serverTime} showDada={showDada}  />
                    })
                }


                <div className="pagination-wrap">
                    {
                        (orders && orders.length > 0) ? <Pagination className="pagination-main" defaultPageSize={10} current={current} total={total} onChange={(page, pageSize) => { this.onChangePage(page, pageSize) }} />
                            : <div  className="nodata">暂无数据</div>
                    }
                </div>
            </React.Fragment>
        );
    }
}