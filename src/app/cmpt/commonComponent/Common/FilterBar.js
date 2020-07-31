import React from 'react';
import { Form, DatePicker, Input, Button, Select } from 'antd'; 
const { Option } = Select;

export default class FilterBar extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            searchTxt:'',
            printState: 0,
            orderState: 0,
            startTime:'',
            endTime:''
        }       
    } 
    
    onStartChange(date, dateString){
        this.setState({
            startTime : dateString,
        });      
    };

    onEndChange(date, dateString){
        this.setState({
            endTime : dateString
        }); 
    };    

    onChangeText(e) {
        var val = e.target.value;
        this.setState({
            searchTxt: val
        })
    }

    onPrintChange(e){       
        this.setState({
            printState:e
        })
    }

    onStateChange(e){       
        this.setState({
            orderState:e
        })
    }

    onfliter(){
        if (this.props.onHandle) {
            let { searchTxt, printState, orderState, startTime, endTime } = this.state; 
            let p = {                
                keyword: searchTxt               
            }            
            if(this.props.printFlag == undefined){
                Object.assign(p,{ orComType : printState });  
            }
            if(this.props.orderFlag == undefined){
                Object.assign(p,{ sellerState : orderState });  
            }
            if(this.props.dateRangeFlag == undefined){
                Object.assign(p, { beginTime: startTime, endTime: endTime });  
            }
            this.props.onHandle(p)
        }
    }

    render() {
        let { searchTxt, printState, orderState, startTime , endTime } = this.state; 
        let self = this;
        return (
            <div className="fliter-bar marginb10"> 
                <Form layout="inline">                          
                    {
                    self.props.printFlag == false ? null :                         
                        <Form.Item>
                            <Select placeholder="打印状态"  style={{ width: '100px' }} size='large' onChange={(e) => {self.onPrintChange(e)}}>
                                <Option value="0">全部</Option>
                                <Option value="1">已打印</Option>                    
                                <Option value="2">未打印</Option>
                            </Select>
                        </Form.Item>
                    } 
                    {
                    self.props.orderFlag == false ? null :
                        <Form.Item>                      
                            <Select placeholder="处理状态" size='large' style={{ width: '100px' }}  onChange={(e) => {self.onStateChange(e)}}>
                                <Option value="0">全部</Option>
                                <Option value="1">待审核</Option>                    
                                <Option value="2">同意</Option>
                                <Option value="3">不同意</Option>
                            </Select>
                        </Form.Item>
                    }   
                    {
                        self.props.dateRangeFlag == false ? null :  
                        <Form.Item className="date-range">
                            <DatePicker format="YYYY-MM-DD" showToday={false} placeholder="开始时间" size='large' onChange={(date, dateString) =>self.onStartChange(date, dateString)}  className="width150" />
                            <DatePicker format="YYYY-MM-DD" showToday={false} size='large' placeholder="结束时间"  onChange={(date, dateString) =>self.onEndChange(date, dateString)} className="width150" />
                        </Form.Item>
                    }                                         
                    <Form.Item>
                        <Input type='text' size="large" className='add-input width230' placeholder={ self.props.searchPla ? self.props.searchPla: "请输入收货人手机号 或订单号"} value={searchTxt} onChange={(e) => { this.onChangeText(e) }}  ></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button className="ant-btn-l ant-btn-orange br4" onClick={() => { self.onfliter() }}>
                        {self.props.btnFliterTxt ? self.props.btnFliterTxt : '查询'}</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}