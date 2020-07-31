import React from 'react';
import Modal from './ModalSubject';
import IconUser from '../../imgs/ava.png';

import orderApi from '../../../api/orderApi'
import dadaApi from '../../../api/dadaApi'

import EventBus from '../../../service/EventBus'
import { MoneytoFixed} from '../../../service/utils'
import Version from '../../../../../version'
import { DataBusInstance } from '../../../service/databus'
import { Button, Radio, Input, InputNumber, Checkbox} from 'antd';

const RadioGroup = Radio.Group;

export default class ChooseDistributor extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            list: [],
            selected: this.props.selectedDeliverierId,
            radioVal: this.props.payDeliverier ? this.props.payDeliverier: '',
            deliveryFee : this.props.order.deliveryFee,
            mobile: '',
            name: '',
            isCreated: 0,
            typeValue:1,
            dadaTag: false,
            dadaTip: '',
            submitFlag:false,
            queryNote: '',
            isfail: this.props.order.dadaQuery == 2 ? true : false,
            price: this.props.order.goodsAmount+this.props.order.shippingFee,
            dadaBalance:null,
            showDada: false
        }
    }

    /**
     * 1、配送员列表
     * 2、新增配送员
     * 3、确认
     */
    componentDidMount() {        
        this.loadList();
        if( DataBusInstance.getSessionKey().isOpenDada == 1 ){
            this.getDadaInfo();
            if(this.props.showDada==1){
                this.setState({
                    showDada: true
                })
            }
        }        
    }

    loadList = () => {
        let self = this;
        return orderApi.getDeliveriers().then(function (res) {
            self.setState({
                list: res.responseContent
            })
        }) 
    }

    getDadaInfo(){
        let self = this;
        dadaApi.getDada().then(function (res) { 
            // if(res.responseContent.length == 0 || res.responseContent == ''){
            //     self.setState({
            //         dadaTag: true
            //     })                 
            // }
            // else{  
                self.setState({
                    dadaBalance:res.responseContent.balance,
                    // dadaTag: false
                })
                // if(self.props.order.dadaQuery == 2){
                //     self.setState({
                //         queryNote:'收货地址与商家城市不一致，无法使用达达配送'
                //     })
                // }
                // if(self.props.order.dadaQuery == 0 ){
                //     self.rePredada();
                // }
            // }
        })
        dadaApi.getDadaShop().then(function(res){
            if(res.responseContent.length==0||res.responseContent == ''){
                self.setState({
                    dadaTag: true
                })
            }else{
                self.setState({
                     dadaTag: false
                }) 
                if(self.props.order.dadaQuery == 2){
                    self.setState({
                        queryNote:'收货地址与商家城市不一致，无法使用达达配送'
                    })
                }
                if(self.props.order.dadaQuery == 0 ){
                    self.rePredada();
                }    
            }
        })
    }

    rePredada(){
        let self = this;
        dadaApi.rePreOrder(self.props.order.orderId).then(function (res) {
            let  resInfo = res.responseContent; 
            if(resInfo.status==1){
                self.setState({
                    deliveryFee : resInfo.deliveryFee,
                    isfail: false                        
                })
            }else{
                self.setState({
                    isfail: true,
                    queryNote : resInfo.message                        
                })                    
            }
        })
    }

    changeTextX(e, label) {
        var val = e.target.value;
        if (label == 'm') {
            this.setState({
                mobile: val,
            })
        } else if (label == 'n') {
            this.setState({
                name: val
            })
        }
    }

    checkBoxChange(e) {
        var checked = e.target.checked;
        this.setState({
            isCreated: checked ? 1 : 0,
            selected: ''
        })
    }

    onAdded() {
        var mobile = this.state.mobile;
        var name = this.state.name;
        if(!!!name&&!!!mobile){
            EventBus.emit('ERROR_API', '请输入配送员名字和手机号')
            return;
        }else if (!!!name) {
            EventBus.emit('ERROR_API', '请输入配送员名字')
            return;
        }else if (!!!mobile) {
            EventBus.emit('ERROR_API', '请输入配送员手机号')
            return;
        }else if(!(/^[1]([3-9])[0-9]{9}$/.test(mobile))){
            EventBus.emit('ERROR_API', '手机号格式错误')
            return
        }  
       
        var name = this.state.name;
        var self = this;
        orderApi.addDelivery(mobile, name).then(function (res) {
            if (res.resultCode == 1) {
                self.state.selected =  res.responseContent ;
                self.loadList().then(function (resp) {
                    self.setState({
                        isCreated: 0,
                        mobile: '',
                        name:''
                    })
                    self.handleSelected();
                })
            }
        })

    }

    onSelected() { 
        if(this.state.typeValue==1){
            if (this.state.isCreated == 1) {
                this.onAdded()
            } else {
                this.handleSelected();
            }           
        }else{          
            if(this.state.dadaTip >= this.state.price){
                EventBus.emit("ERROR_API", '小费金额需小于订单金额');           
                return;
            } 
            if( this.state.deliveryFee+this.state.dadaTip > this.state.dadaBalance){
                EventBus.emit("ERROR_API", '账户余额不足，无法发单');           
                return;
            }
            if (this.props.onSelected) {
                var arg = {
                    type:'dada',
                    dadaTip:this.state.dadaTip
                }
                this.props.onSelected(arg)
            }                       
        }  
    }

    handleSelected() {
        const id  = this.state.selected;
        let filters = this.state.list.filter(function (item) {
            return item.id == id
        })
        if (filters.length == 0) {
            EventBus.emit("ERROR_API", "请选择一个配送人员")
            return;
        }       
        if (this.state.radioVal === undefined || this.state.radioVal === '') {
            EventBus.emit("ERROR_API", "请输入配送费")
            return;
        }
        if (this.props.onSelected) {
            var arg = {
                type:'deliveryman',
                deliver: filters[0],
                val: this.state.radioVal            
            }
            this.props.onSelected(arg)
        }
    }

    handleChange = (e) => {      
        var val = e.target.value;       
        this.setState({
            selected: val,
            isCreated: 0
        })        
    }

    changeText(e) {
        this.setState({
            radioVal: e
        })
    }

    changeTip(e) {
        this.setState({
            dadaTip: e
        })
    }

    typeChange = (e) =>{
        this.setState({
            typeValue: e.target.value
        });        
        if(this.state.isfail){
            if(e.target.value==1){
                this.setState({
                    submitFlag: false
                })
            }else{
                this.setState({
                    submitFlag: true
                })
            }            
        }
    }    

    limitDecimals(value) {        
        const reg = /^(\-)*(\d+)\.(\d\d).*$/;
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
            return ''
        }
    }

    limitDecimals2(value) {        
        const reg = /^(\-)*(\d+)\.(\d).*$/;
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
            return ''
        }
    }

    render() {
        var { list, selected, radioVal, mobile, name, isCreated, typeValue, dadaTag, dadaTip, deliveryFee, queryNote , showDada } = this.state;     var self = this;         
        return (
            <Modal close={this.props.close} title='发货' height='100%' width="620px">
                <div className='modal-content-content modal-content-content-style dlg-choose-wrap modal-choose-distributor'>
                    { showDada ?
                    <div className="form-default">
                        <dl>
                            <dt>配送方式：</dt>
                            <dd>
                                <Radio.Group className="delivery-type" onChange={this.typeChange} value={this.state.typeValue}>
                                    <Radio value={1} className="marginr10">自主配送员配送</Radio>
                                    <Radio value={2} disabled={dadaTag}>达达配送</Radio>        
                                </Radio.Group>
                                { 
                                    (dadaTag == false) ? 
                                    <span className="colorg">(配送费预计：
                                        { 
                                            deliveryFee == 0 ? 
                                            '暂无': <span className="colory">{MoneytoFixed(self.state.deliveryFee)}元</span>
                                        }
                                    )</span> : <Button className="btn-txt-orange pd0" onClick={() => { EventBus.emit('OPEN_URL', Version().site_url) }}>前往商户后台申请接入达达&raquo;</Button> 
                                }
                            </dd>
                        </dl>
                    </div> : null
                    }
                    {  
                        typeValue == 1 ?   
                        <div className="form-default">                 
                            <dl>
                                <dt>选择配送员：</dt>
                                <dd>
                                    <div className='clear-float diliveryman-box'>
                                        {
                                            list ?
                                            <RadioGroup onChange={this.handleChange} value={this.state.selected}>
                                                {
                                                    list.map(function (item, index) {
                                                        return <div className="dlg-item" key={index}><Radio className="dlg-choose-radiostyle" value={item.id}><img src={item.memberAvatar} /><span className="name" title={item.trueName}>{item.trueName}</span></Radio></div>
                                                    })
                                                }
                                            </RadioGroup> : null
                                        }
                                    </div>
                                    <div className='clear-float margint10'>
                                        <Checkbox checked={isCreated == 1 ? true : false} onChange={(e) => { this.checkBoxChange(e) }}>新增并选定配送员</Checkbox>
                                    </div>
                                    {
                                        isCreated == 1 ?
                                            <div className='new-diliveryman'>
                                                <div className='colory fonts12'>
                                                    配送员需先注册成为【我的身边店】用户。
                                                </div>                                           
                                            <Input type="text" className='add-input width170' placeholder='请输入配送员姓名' value={name} onChange={(e) => { this.changeTextX(e, 'n') }} />
                                            <Input type="text" className='add-input width170' placeholder='请输入配送员手机号码' value={mobile} onChange={(e) => { this.changeTextX(e, 'm') }} /> 
                                            </div> : null
                                    }
                                </dd>
                            </dl> 
                            <dl>
                                <dt>配送费用：</dt>
                                <dd><InputNumber type="text" className='add-input width300'
                                min={0}
                                step={1.00}
                                formatter={this.limitDecimals}
                                parser={this.limitDecimals} placeholder='请输入支付给配送员的金额' value={radioVal} onChange={(e) => { this.changeText(e) }} /></dd>
                            </dl> 
                        </div>
                        : 
                        <div>
                            <div className="form-default"> 
                                <dl>
                                    <dt>订单配送费：</dt>
                                    <dd>￥{MoneytoFixed(this.props.order.shippingFee)}</dd>
                                </dl>
                                <dl>
                                    <dt>达达运费：</dt>
                                    <dd> 
                                        { 
                                            deliveryFee == 0 ? 
                                            '暂无': <span>￥{MoneytoFixed(self.state.deliveryFee)}</span>
                                        }
                                    </dd>
                                </dl>
                                {/* <dl>
                                    <dt>达达小费：</dt>
                                    <dd><InputNumber type="text" className='add-input width300'
                                    min={0}
                                    step={1.00}
                                    formatter={this.limitDecimals2}
                                    parser={this.limitDecimals2}  placeholder='若订单较为紧急，可给订单增加小费' value={dadaTip} onChange={(e) => { this.changeTip(e) }} /></dd>
                                </dl> */}
                            </div> 
                            { queryNote != '' ? <div className="colorred margint20">{queryNote}</div> : null }
                            <div className="colorg margint20 marginb20">
                                <div>达达需知</div>
                                <div>1：达达订单可能存在特殊情况，存在无法预期送达的风险</div>
                                <div>2：订单10分钟内可无条件取消订单，届时若对应达达已接单，取消订单产生的费用需要商户自行承担</div>
                                <div>3：达达订单在骑手接单15分钟内支持取消订单，运费退回，同时扣除2元作为给配送员的违约金；未接单前可随时取消订单</div>
                            </div>
                        </div>                   
                    }                  
                    <div className='modal-content-btn'>
                        {/* <Button className='modal-footer-btn-white marginRight10'   onClick={this.props.onAddDistributer}>新增配送员</Button> */}
                        <Button className='modal-footer-btn ant-btn-orange' onClick={() => { this.onSelected() }} disabled={self.state.submitFlag} >确认</Button>
                        <Button className='modal-footer-btn-white' onClick={this.props.close}>取消</Button>
                    </div>
                </div>

            </Modal>
        );
    }
}