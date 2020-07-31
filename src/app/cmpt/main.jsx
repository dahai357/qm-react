import React from 'react';
import { Layout, Menu, message, Icon, Modal} from 'antd';
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout;
import Logo from './imgs/icon-logo.jpg';
import { Route, withRouter } from 'react-router-dom';


import minIcon from './imgs/min.png';
import maxIcon from './imgs/max.png';
import closeIcon from './imgs/close.png';

import OrderManagerAll from './pages/OrderManager/OrderManager';
import OrderWaitReceive from './pages/OrderManager/OrderWaitReceive';
import OrderWaitDistribution from './pages/OrderManager/OrderDistribution';
import OrderSelfLifting from './pages/OrderManager/OrderSelfLifting';
import OrderWaitPay from './pages/OrderManager/OrderWaitPay';
import OrderWaitCancel from './pages/OrderManager/OrderWaitCancel';
import OrderDada from './pages/OrderManager/OrderDada';

import ShouhouManager from './pages/ShouhouManager/ShouhouManager';
import ShouhouHandle from './pages/ShouhouManager/ShouhouHandle';
import ShouhouReceive from './pages/ShouhouManager/ShouhouReceive';
import StockMange from './pages/StockManage/StockManage';


import { initDrag } from '../service/listener'

import './main.less';

import '../index.less'

import BaseCmpt from '../cmpt/basecmpt';

import MenuData from './menuData';

import EventBus from '../service/EventBus'

import SetModal from '../cmpt/more/ModalSet'

import FeedModal from '../cmpt/more/ModalFeed'

import { DataBusInstance } from '../service/databus'

import AudioPlayer from '../cmpt/commonComponent/Audio/AudioPlayer'

import loginApi from '../api/loginApi'
import dadaApi from '../api/dadaApi'
import CheckUpdateModal from './commonComponent/Modal/CheckUpdateModal';
import OkModal from './commonComponent/Modal/OkModal';
import ModalMsg from './commonComponent/Modal/ModalMsg';
import { DeepCopy } from '../service/utils'

import Version from '../../../version'
import moreApi from '../api/moreApi'
import AlertTip from '../service/alerttip'

@withRouter
export default class Main extends BaseCmpt {

    updateUrl;
    alertTip;
    constructor(props) {
        super(props);
        this.state = {
            menus: [],
            updated: true,
            mainKey: ['1'],
            subKey: ['0'],
            showFeedModal: false,
            showSetModal: false,
            showCheckUpdate: false,
            updateUrl: '',
            version: Version().v_label,
            showOffNet: false,
            noShowOffNet: 0,
            showModalMsg: false,
            modalMsgTxt: '',
            modalMsgType: 1
        };
        this.alertTip = new AlertTip();
    }   

    handleMenu = (id, index) => {
        //点击头部tab切换的时候修改被点击的tab的样式以及路由跳转
        let tempMenuData = this.state.menus;
        let url = '';
        for (let i = 0; i < tempMenuData.length; i++) {
            if (tempMenuData[i].id === id) {
                tempMenuData[i].selected = true;
                url = tempMenuData[i].url;
            } else {
                tempMenuData[i].selected = false;
            }
            let tempChildren = tempMenuData[i].children;
            for (let j = 0; j < tempChildren.length; j++) {
                if (j === 0) {
                    tempChildren[j].selected = true;
                } else {
                    tempChildren[j].selected = false;
                }
            }
        }
        this.setState(
            {
                menus: tempMenuData,
                updated: !this.state.updated,
                mainKey: [index],
                subKey: ['0']
            }
        );
        this.props.history.push(url);
    }

    handleSubMenu = (subid, index) => {
        //点击子路由，修改子路由的样式，以及路由的跳转
        let url = '';
        let tempMenuData = this.state.menus;
        for (let i = 0; i < tempMenuData.length; i++) {
            let tempChildren = tempMenuData[i].children;
            for (let j = 0; j < tempChildren.length; j++) {
                if (tempChildren[j].id === subid) {
                    tempChildren[j].selected = true
                    url = tempChildren[j].url;
                } else {
                    tempChildren[j].selected = false
                }
            }
        }
        this.setState(
            {
                menus: tempMenuData,
                updated: !this.state.updated,
                subKey: [index]
            }
        );
        this.props.history.push(url);
    }

    componentDidMount() {         
        this.getDadaInfo();
        this.checkUpdate(); 
        initDrag();
        EventBus.onSingle('USER_LOGOUT_TWO', this.LoginOut.bind(this));
        EventBus.onSingle('USER_LOGOUT', this.jumpLogin.bind(this));
        EventBus.onSingle('TOTAL_CHANGED', this.reflushMenuNum.bind(this));
        EventBus.onSingle('ERROR_API', this.showMsg.bind(this,0));
        EventBus.onSingle('SUCCESS_API', this.showMsg.bind(this,1));
        EventBus.onSingle('NEED_UPDATE', this.onNeedUpdate.bind(this));   
        EventBus.onSingle('BACK_TOP', this.scrollToTop.bind(this)); 
        EventBus.onSingle('OFF_NET', this.onOffNet.bind(this));             
        EventBus.onSingle('SYS_SHOW_SETTING', function () {
            this.setState({
                showSetModal: true
            })
        }.bind(this));        
        this.playNewAudio();     
    }     
    
    hideDada() {
       var self = this, 
       MenuArr = DeepCopy(MenuData),        
       MenuChildArr = MenuArr[0].children; 
       MenuChildArr.forEach(function(item, index, arr) {                    
            if(item.name == "达达配送") {
                MenuChildArr.splice(index, 1);
                return;
            }
        });
        MenuArr[0].children = MenuChildArr;
        self.setState({ menus: MenuArr }, ()=> {
            self.reflushMenuNum(DataBusInstance.getSessionKey()); 
        })        
    }

    getDadaInfo(){              
        var self = this,
        MenuArr = DeepCopy(MenuData);  
        if(DataBusInstance.getSessionKey().isOpenDada==0){
            self.hideDada();           
        }else{
            // dadaApi.getDada().then(function (res) { 
            //     if(res.responseContent.length == 0 || res.responseContent == ''){              
            //        self.hideDada();
            //     }else{
            //         self.setState({ menus: MenuArr}, ()=> {
            //             self.reflushMenuNum(DataBusInstance.getSessionKey()); 
            //         })                      
            //     }  
            // })
            dadaApi.getDadaShop().then(function(res){
                if(res.responseContent.length == 0 || res.responseContent == ''){              
                    self.hideDada();
                 }else{
                     self.setState({ menus: MenuArr}, ()=> {
                         self.reflushMenuNum(DataBusInstance.getSessionKey()); 
                     })                      
                 }  
            })
        }  
        
    }

    checkUpdate(){
        var self = this;
        moreApi.getVersion(Version().v_support).then(function (res) {
            if (res.resultCode == 1) {
                var resp = res.responseContent
                var version = resp.version.replace(new RegExp('\\.', "g"), '')
                if (Number(version) > Version().v_code) {
                    EventBus.emit('NEED_UPDATE', resp.updateUrl);
                }
            }
        })
    }

    showMsg(type,info) {
        var self = this;
        self.setState({
            modalMsgTxt: info,
            modalMsgType: type,
            showModalMsg: true
        },()=> {
            setTimeout(() => {
                self.setState({
                    showModalMsg: false
                }) 
            },2000)  
        })
    }

    jumpLogin(type) {        
        let self = this;
        loginApi.logout().then(function (res) {
            if (res.resultCode == 1) {                
                if(type&&type=='relogin'){
                    self.props.history.push({
                        pathname:'/',
                        params:{
                            type: type
                        }
                    })
                }else{
                    self.props.history.push('/');
                }   
                clearInterval(self.timer);         
                EventBus.emit('USER_LOGOUT_SYS');                
            }
        })
    }
    LoginOut(){
        this.props.history.push('/');
    }

    playNewAudio(){
        this.timer = setInterval(function(){
            try{
                loginApi.count().then(function (res) {
                    if(res && res.responseContent.waitReceiveCount>0){                                      
                        EventBus.emit('PLAY_AUDIO');
                    }
                })
            }catch(e){}
        },30000)
    }


    /** 
     * @param {*} data 
     */
    reflushMenuNum(data) {
        var menus = this.state.menus; 
        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            menu.num = menu.key ? (data[menu.key] || 0) : 0
            var children = menu.children;
            if (children) {
                for (var j = 0; j < children.length; j++) {
                    var submenu = children[j];
                    submenu.num = submenu.key ? (data[submenu.key] || 0) : 0
                }
            }
        }
        this.setState({
            menus: menus,
            updated: !this.state.updated
        })        
    }

    onNeedUpdate(url) {
        var _updateUrl = url;
        this.setState({
            showCheckUpdate: true,
            updateUrl: _updateUrl
        })    
    } 

    handleUpdate(){
        this.setState({
            showCheckUpdate: false
        }) 
    }

    scrollToTop(){                  
        let anchorElement = document.getElementById('top');            
        if(anchorElement) { anchorElement.scrollIntoView(); }      
    }

    onOffNet(state){
        var noFlag = this.state.noShowOffNet;
        if(state==1 && noFlag==0){
            this.setState({
                showOffNet: true
            })  
        }else{ 
            this.setState({
                showOffNet: false,
                noShowOffNet:0
            }) 
        }
    }

    handleOffNet(){
        var self = this;
        self.setState({ 
            showOffNet: false, 
            noShowOffNet:1
        })
        self.alertTip.reconnectSocket('noTimer');
    }


    render() {
        //路由信息
        let {
            mainKey,
            subKey,
            showSetModal,
            showFeedModal,
            showCheckUpdate,
            updateUrl,
            showOffNet,
            noShowOffNet,
            showModalMsg,
            modalMsgType,
            modalMsgTxt
        } = this.state
        let targetMenu = this.state.menus;        
        //查询当前路由对应要展示的子路由页面
        let targetChildren = [];
        for (let i = 0; i < targetMenu.length; i++) {
            if (targetMenu[i].selected) {
                targetChildren = targetMenu[i].children;
            }
        } 
        return (
            <Layout className='index'>                
                <Header className="index-header c-webkit-drag-region" style={{ '-webkit-app-region': 'drag' }}>
                    <div className="header-opt" style={{ '-webkit-app-region': 'no-drag' }}>
                        <div className="header-btn header-opt-1" onClick={() => { EventBus.emit('WINDOW_MIN') }} ><img src={minIcon} /></div>
                        <div className="header-btn header-opt-1" onClick={() => { EventBus.emit('WINDOW_FULLSCREEN') }}><img src={maxIcon} /></div>
                        <div className="header-btn header-opt-1" onClick={() => { EventBus.emit('WINDOW_CLOSE') }}><img src={closeIcon} /></div>
                    </div>
                    <div className='header-logo'>
                        <img className='icon-logo' src={Logo} alt="我的身边店" />
                    </div>                    
                    <Menu theme="dark" mode="horizontal" selectedKeys={mainKey} className="custom-menu">
                        {/*头部路由展示*/}
                        {  
                            targetMenu.map((item, index) => (
                                <li style={{ '-webkit-app-region': 'no-drag' }} key={index + ''} onClick={e => this.handleMenu(item.id, index + '')} className={item.selected ? "header-submenu header-submenu-selected" : "header-submenu"}><img className='order-manager' src={item.selected ? item.selectedimg : item.img} alt="" />
                                    {item.name}
                                    {
                                        (!item.selected && item.num > 0) ? <div className="header-badge">{item.num > 99 ? '99+' : item.num}</div> : null
                                    }
                                </li>
                            ))
                        }
                    </Menu>                    
                </Header>
                <Layout>
                    <Sider className='main-leftmenu' width={160}>
                        <Menu mode="inline" selectedKeys={subKey} className="custom-leftmenu" inlineIndent="32">
                            {/*子路由展示*/}
                            {
                                targetChildren.map((item, index) => (
                                    <Menu.Item key={index + ''} onClick={() => this.handleSubMenu(item.id, index + '')}
                                        className={'left-submenu ' + (item.selected ? 'left-submenu-selected' : 'left-submenu-normal')}>
                                        <img className='order-manager' src={item.selected ? item.selectedimg : item.img} alt="" />{item.name}{item.num > 0 ? (item.num > 99 ? '(99+)' : ('(' + item.num + ')')) : null}</Menu.Item>
                                ))
                            }
                        </Menu>
                        <Menu mode="vertical" className="left-submenu more-menu" triggerSubMenuAction="click">
                            <SubMenu title="更多" >
                                <Menu.Item onClick={() => { EventBus.emit('OPEN_URL', Version().site_url) }}>前往商户后台</Menu.Item>
                                <Menu.Item onClick={() => { this.setState({ showFeedModal: true }) }}>意见反馈</Menu.Item>
                                <Menu.Item onClick={() => { this.setState({ showSetModal: true }) }}>设置</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout className='main-content'>      
                        <a id="top" className="top"></a>                 
                        <Content className="main-content-warp">
                            {/*根据路由展示不同的内容页面*/}
                            <Route exact path='/main' component={OrderManagerAll} />
                            <Route path='/main/ordermanager/receive' component={OrderWaitReceive} />
                            <Route path='/main/ordermanager/peisong' component={OrderWaitDistribution} />
                            <Route path='/main/ordermanager/dada' component={OrderDada} />
                            <Route path='/main/ordermanager/ziti' component={OrderSelfLifting} />
                            <Route path='/main/ordermanager/pay' component={OrderWaitPay} />
                            <Route path='/main/ordermanager/cancel' component={OrderWaitCancel} />
                            <Route path='/main/shouhou/all' component={ShouhouManager} />
                            <Route path='/main/shouhou/manage' component={ShouhouHandle} />
                            <Route path='/main/shouhou/receive' component={ShouhouReceive} />
                            <Route path='/main/kucun/all' component={StockMange} />
                        </Content>
                    </Layout>
                </Layout>
                {
                    showSetModal ? <SetModal close={() => { this.setState({ showSetModal: false }) }}></SetModal> : null
                }
                {
                    showFeedModal ? <FeedModal close={() => { this.setState({ showFeedModal: false }) }}></FeedModal> : null
                }
                {
                    showCheckUpdate ? <CheckUpdateModal 
                        close={() => { this.setState({ showCheckUpdate: false }) }} 
                        updateUrl={updateUrl}></CheckUpdateModal> : null
                }
                {
                    showOffNet ?
                        <OkModal tipCon={'无法连接服务器，请检查您的网络连接，尝试重新连接'} hideBtnClose={true} onHandle={() => { this.handleOffNet() }}  close={() => { this.handleOffNet() }} ></OkModal> : null
                }  
                {
                    showModalMsg ? <ModalMsg title={ modalMsgTxt }  type={ modalMsgType }   close={() => { this.setState({ showModalMsg: false }) }} ></ModalMsg> : null
                }
                <AudioPlayer></AudioPlayer>                
            </Layout>
        )
    }
}
