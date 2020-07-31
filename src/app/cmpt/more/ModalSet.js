import React from 'react'

import AntModal from './AntModal'

import { Layout, Button } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import './more.less'

import loginApi from '../../api/loginApi'
import moreApi from '../../api/moreApi'

import BigIcon from '../imgs/big-logo.png'

import { DataBusInstance } from '../../service/databus'

import EventBus from '../../service/EventBus'

import Version from '../../../../version'

export default class SetModal extends React.Component {

    constructor(props) {
        super(props)
        this.copyright = '@ ' + new Date().getFullYear() + ' 福州千盟经贸有限公司 版权所有'
        this.props = props;
        this.state = {
            showPanel: 1,
            version: Version().v_label,
            member: DataBusInstance.getSessionKey() || {},
            versionTip:''
        }
    }

    componentDidMount() {
    }

    changeBox(e) {
        this.setState({
            showPanel: e
        })
    }

    logout() {
        EventBus.emit('USER_LOGOUT')
    }

    checkUpdate() {
        var self = this;
        moreApi.getVersion(Version().v_support).then(function (res) {
            if (res.resultCode == 1) {
                var resp = res.responseContent
                var version = resp.version.replace(new RegExp('\\.', "g"), '')
                if (Number(version) > Version().v_code) {
                    EventBus.emit('NEED_UPDATE', resp.updateUrl);
                }else{
                    self.setState({
                        versionTip:'已经是最新版本'
                    })
                }
            }else{
                self.setState({
                    versionTip:'检测失败，请重新检测'
                })
            }
        })
    }



    render() {
        let {
            showPanel,
            version,
            member,
            versionTip
        } = this.state
        return (
            <AntModal close={this.props.close}>
                <div className="dialog-left">
                    <div className="dialog-left-wrap" >
                        <div className="dialog-left-label">  设置 </div>
                        <div className={showPanel == 1 ? 'dialog-left-menu dialog-left-menu-active' : 'dialog-left-menu'} onClick={() => { this.changeBox(1) }}>
                            <div className="dialog-left-menu-label">账号设置</div>
                        </div>
                        <div className={showPanel == 2 ? 'dialog-left-menu dialog-left-menu-active' : 'dialog-left-menu'} onClick={() => { this.changeBox(2) }}>
                            <div className="dialog-left-menu-label">版本更新</div>
                        </div>
                        <div className={showPanel == 3 ? 'dialog-left-menu dialog-left-menu-active' : 'dialog-left-menu'} onClick={() => { this.changeBox(3) }}>
                            <div className="dialog-left-menu-label">关于我们</div>
                        </div>
                    </div>
                </div>
                <div className="dialog-right">
                    {
                        showPanel == 1 ?
                            <div className="dialog-right-wrap">
                                <img src={member.storeLabel} className="avatar"></img>
                                <div className="item">
                                    {member.storeName}
                                </div>
                                <div className="item">
                                    登录账号：{member.memberMobile}
                                </div>
                                <Button onClick={() => { this.logout() }}>
                                    退出登录
                                </Button>                                
                            </div> : null
                    }
                    {
                        showPanel == 2 ?

                            <div>
                                <div className="dialog-right-wrap">
                                    <div className="item current-version">
                                        当前版本： {version ? version : '1.0.0'}
                                    </div>
                                    <div className="item colory">
                                        {versionTip}
                            </div>

                                    <Button onClick={() => { this.checkUpdate() }}>
                                        检测新版本
                            </Button>

                                </div>
                                <div className="dialog-right-footer">{this.copyright}</div>
                            </div> : null
                    }
                    {
                        showPanel == 3 ?
                            <div>                                
                                <div className="dialog-right-wrap">
                                    <img className="logo" src={BigIcon}>
                                    </img>
                                </div>
                                <div className="dialog-right-footer">{this.copyright}</div>
                            </div> : null
                    }
                </div>
            </AntModal>
        )
    }

}