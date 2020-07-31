import React, { Fragment } from 'react'
import refundsApi from '../../../api/refundsApi'
import ShouhouAll from '../../commonComponent/Shouhou/Shouhou'
import loginApi from '../../../api/loginApi'
import FilterBar from '../../commonComponent/Common/FilterBar';
import EventBus from '../../../service/EventBus';
import { Pagination } from 'antd' 
import { UpdateMenuNum } from '../../../service/utils';

export default class ShouhouManager extends React.Component {

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
        refundsApi.getRefunds(page, 0, arg).then(function (res) {
            var _refunds = res.responseContent.refundReturns || [];
            var _total = res.responseContent.totalCount || 0;
            self.setState({
                refunds: _refunds,
                total: _total
            })
            EventBus.emit('BACK_TOP');
            if(!noUpdateFlag){
                loginApi.count().then(function (_res) {
                    UpdateMenuNum('refundCount',_res.responseContent.refundCount);
                })
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
            <Fragment>
                <FilterBar printFlag={false}  searchPla={'请输入订单号'}   onHandle={(p) => { this.onChangeFliter(p) }}></FilterBar> 
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
            </Fragment>
        );
    }
}