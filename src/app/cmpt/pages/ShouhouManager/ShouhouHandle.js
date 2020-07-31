import React from 'react'
import refundsApi from '../../../api/refundsApi'
import ShouhouAll from "../../commonComponent/Shouhou/Shouhou"
import FilterBar from '../../commonComponent/Common/FilterBar';
import { UpdateMenuNum } from '../../../service/utils';
import EventBus from '../../../service/EventBus';
import { Pagination } from 'antd' 

export default class ShouhouHandle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refunds: [],
            total: 0,
            current: 1,
            arg:''
        }
    }

    componentDidMount() {
        this.loadData(1)
    }

    loadData(page,arg,noUpdateFlag) {
        var self = this;
        refundsApi.getRefunds(page, 1, arg).then(function (res) {
            var _refunds = res.responseContent.refundReturns || [];
            var _total = res.responseContent.totalCount || 0;
            self.setState({
                refunds: _refunds,
                total: _total
            })
            EventBus.emit('BACK_TOP');
            if(!noUpdateFlag){
                UpdateMenuNum('waitRefundProccessCount',_total); 
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
        let { refunds, current, total } = this.state;
        return (
            <React.Fragment>
                <FilterBar printFlag={false} orderFlag={false} searchPla={'请输入订单号'} onHandle={(p) => { this.onChangeFliter(p) }}></FilterBar>
                {
                    refunds.map(function (ret) {
                        return (
                            <ShouhouAll key={ret.refundId} retItem={ret} />
                        )
                    })
                }
                <div className="pagination-wrap">
                    {
                        (refunds && refunds.length > 0) ? <Pagination className="pagination-main" defaultPageSize={10} current={current} total={total} onChange={(page, pageSize) => { this.onChangePage(page, pageSize) }} />
                            : <div  className="nodata">暂无数据</div>
                    }
                </div>
            </React.Fragment>
        );
    }
}