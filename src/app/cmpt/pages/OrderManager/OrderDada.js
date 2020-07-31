import React from 'react'
import Distribution from '../../commonComponent/Order/Distribution/Distribution'
import BaseCmpt from '../../../cmpt/basecmpt'
import dadaApi from '../../../api/dadaApi'

import EventBus from '../../../service/EventBus'
import FilterBar from '../../commonComponent/Common/FilterBar';

import { Tabs, Pagination, Button} from 'antd'

export default class OrderDada extends BaseCmpt {
    constructor(props) {
        super(props)
        const panes = [
            { title: '全部', key: '0' },
            { title: '待接单', key: '1' },
            { title: '已取消', key: '5' },
            { title: '已过期', key: '7' },
            { title: '待取货', key: '2' },
            { title: '配送中', key: '3' },
            { title: '异常', key: '9' },
        ];
        this.state = {
            orders: [],
            total: 0,
            current: 1,
            activeKey:0,
            arg:'',  
            showDada:'',          
            panes            
        }
    }

    componentDidMount() {
        this.loadData(1,0);                  
    }    

    loadData(page,key,arg) {
        var self = this;       
        self.setState({
            orders:[]
        })        
        dadaApi.orderList(page, key, arg).then(function (res) {     
            var _orders = res.responseContent.orders || [];
            var _total = res.responseContent.totalCount || 0;
            var _servTime = res.responseTime || Math.floor(new Date().getTime() / 1000)
            self.setState({
                orders: _orders,
                total: _total,
                serverTime: _servTime,
                showDada: res.responseContent.showDada
            })   
            EventBus.emit('BACK_TOP');          
        })
    }

    onChangePage(page, pageSize) {        
        this.setState({
            current: page
        })
        this.loadData(page,this.state.activeKey,this.state.arg)
    }

    onChangeTab(key){        
        this.setState({
            current: 1,
            activeKey: key
        })
        this.loadData(1,key);
    }
    
    onChangeFliter(p){
        var self = this;        
        self.loadData(1,self.state.activeKey,p);  
        self.setState({
            arg:p,
            current: 1
        })     
    }

    render() {
        let { orders, total, current, serverTime, activeKey, showDada } = this.state; 
        const { TabPane } = Tabs;  
        return (            
            <React.Fragment>                 
               <Tabs defaultActiveKey="0" onChange={this.onChangeTab.bind(this)} animated={false}>
                {this.state.panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key}>
                        {
                            activeKey == pane.key ? 
                            <div>
                                <FilterBar orderFlag={false} onHandle={(p) => { this.onChangeFliter(p) }}></FilterBar>                                
                                { 
                                    orders.map(function (order) {
                                        return <Distribution key={order.orderId} order={order} serverTime={serverTime} showDada={showDada} />
                                    })
                                }
                                <div className="pagination-wrap">
                                    { 
                                        (orders && orders.length > 0) ? <Pagination className="pagination-main" defaultPageSize={10} current={current} total={total} key={pane.key} onChange={(page, pageSize) => { this.onChangePage(page, pageSize) }} />
                                            : <div  className="nodata">暂无数据</div>
                                    }
                                </div>
                            </div> : null
                        }
                        
                    </TabPane>
                ))}
                </Tabs>                 
            </React.Fragment>
        );
    }
}