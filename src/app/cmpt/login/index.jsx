import React from 'react';

import { withRouter } from 'react-router-dom'
import loginIcon from '../imgs/login.png';
import avaIcon from '../imgs/ava.png';

import errIcon from '../imgs/icon-error.png';

import minIcon from '../imgs/min.png';
import maxIcon from '../imgs/max.png';
import closeIcon from '../imgs/close.png';

import inputIcon from '../imgs/input.png';

import icon1Icon from '../imgs/icon1.png';
import icon2Icon from '../imgs/icon2.png';
import loginbtnIcon from '../imgs/loginbtn.png';

import logoIcon from '../imgs/logo.png';
import portraitIcon from '../imgs/portrait.png';

import './login.less';

import loginApi from '../../api/loginApi'

import { DataBusInstance } from '../../service/databus'

import EventBus from '../../service/EventBus'

import { initDrag } from '../../service/listener'

import { Icon } from 'antd'

import OffLineModal from '../../cmpt/commonComponent/Modal/OffLineModal';

@withRouter
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,//控制错误信息显示
            account:'',// '18305954587',
            password:'', //'123456a',
            error: '',
            showOffLineModal:false
        };
    }

    textChange(e, t) {
        var val = e.target.value;
        if (t == 1) {
            this.setState({
                account: val
            })
        } else if (t == 2) {
            this.setState({
                password: val
            })
        }

    }

    login = () => {
        //调用登录接口，成功后跳转页面，失败后显示错误提示
        // ; 
        var self = this;
        loginApi.login(self.state.account, self.state.password)
            .then((res) => {
                if (res.resultCode == 1) {
                    DataBusInstance.setSessionKey(res.responseContent)                     
                    DataBusInstance.setUserKey({'UserName':self.state.account,'UserPass': self.state.password})                     
                    EventBus.emit('USER_LOGIN_SYS', res.responseContent)
                    self.props.history.push('/main');
                } else {
                    self.setState({
                        showError: true,
                        error: res.shortMessage
                    })
                }
            })
            .catch((error) => {
                self.setState({
                    showError: true,
                    error: error.message || error
                })
            })
    }


    componentDidMount() {
        initDrag()
        window.onkeypress = this.handleKeyPress.bind(this)
        if(this.props.history.location.params && this.props.history.location.params.type=='relogin'){ 
            this.setState({
                showOffLineModal: true
            })
        }
    }
    componentWillUnmount() {
        window.onkeypress = null;
    }

    handleKeyPress(e) {
        let self = this;
        if (e.which == 13) {
            self.login()
        }
    }

    handleReLogin(){
        let self = this,
        user = DataBusInstance.getUserKey();
        self.setState({
            account: user.UserName,
            password: user.UserPass,
            showOffLineModal: false
        })
    }


    render() {
        let {
            showError,
            account,
            password,
            error,
            showOffLineModal
        } = this.state;

        let session = DataBusInstance.getSessionKey();        
        return (
            <div>
                <div className="div1">
                    <div style={{ '-webkit-app-region': 'drag' }} className="header-opt-login  c-webkit-drag-region">
                        <div className="header-opt-warp" style={{ '-webkit-app-region': 'no-drag' }} >
                            <div className="header-btn header-opt-item header-btn-shrink" onClick={() => { EventBus.emit('WINDOW_MIN') }} ><img src={minIcon} /> </div>
                            <div className="header-btn header-opt-item" onClick={() => { EventBus.emit('WINDOW_CLOSE') }}><img src={closeIcon} /></div>
                        </div>
                    </div>
                    <div className="wrap">
                        <div className="div2">
                            <img src={loginIcon} />

                        </div>
                        <div className="div3">
                        {
                            session ?                            
                                <img src={session.storeLabel} />  : <img src={ portraitIcon} />
                        }
                        </div> 
                        <div className="div4">
                            <img src={inputIcon} />
                        </div>

                        <div className="div5">
                            <img src={icon1Icon} />
                        </div>

                        <input type="text" name="" placeholder="请输入手机号" id="input1" value={account} onChange={(e) => { this.textChange(e, 1) }} />
                        <div className="div6">
                            <img src={inputIcon} />
                        </div>

                        <div className="div7">
                            <img src={icon2Icon} />
                        </div>

                        <input type="password" name="" placeholder="请输入密码" id="input2" value={password} onChange={(e) => { this.textChange(e, 2) }} />
                        <div className="diverror">
                            {
                                showError ? <div className="font12"><img src={errIcon} /> <span className="errorLabel">{error}</span></div> : null
                            }

                        </div>



                        <div className="divbutton" onClick={() => { this.login() }}>
                            登录
                        </div>
                        
                    </div>
                    <div className="divcom">
                        <font>@ {new Date().getFullYear()} 福州千盟经贸有限公司 版权所有</font>
                    </div>
                    <div className="divmyshop">
                        <img src={logoIcon} />
                    </div>
                </div>
                {
                    showOffLineModal ? 
                    <OffLineModal onHandle={() => { this.handleReLogin()}}  close={()=>{this.setState({showOffLineModal:false})}}></OffLineModal>: null
                }
            </div>
        )
    }
}