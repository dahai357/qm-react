import React from 'react'
import Distribution from '../../commonComponent/Order/Distribution/Distribution'
import BaseCmpt from '../../basecmpt'
import orderApi from '../../../api/orderApi'
import { Pagination, Input, Form, Button } from 'antd'
import FilterBar from '../../commonComponent/Common/FilterBar';
import EventBus from '../../../service/EventBus';
const FormItem = Form.Item;

export default class OrderWaitPay extends BaseCmpt {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            total: 0,
            current: 1,
            keyword: '',
            arg:''
        }
    }

    componentDidMount() {
        this.loadData(1)
    }

    loadData(page,arg) {
        var self = this;
        orderApi.orderList(page, 10, arg).then(function (res) {
            var _orders = res.responseContent.orders || [];
            var _total = res.responseContent.totalCount || 0;
            var _servTime = res.responseTime || Math.floor(new Date().getTime() / 1000)
            self.setState({
                orders: _orders,
                total: _total,
                serverTime:_servTime
            })
            EventBus.emit('BACK_TOP');         
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
        self.loadData(1,p);   
        self.setState({
            arg:p,
            current: 1
        })   
    }

    render() {
        let { orders,
            total,
            current,
            keyword ,serverTime} = this.state;
        return (
            <React.Fragment>
                <FilterBar orderFlag={false} printFlag={false} dateRangeFlag={false} btnFliterTxt={'搜索'} onHandle={(p) => { this.onChangeFliter(p) }}></FilterBar>               
                {
                    orders.map(function (order) {
                        return <Distribution key={order.orderId} order={order} serverTime={serverTime} />
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