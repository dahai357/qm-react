import React from 'react';
import ReactDOM from 'react-dom';

import EventBus from './service/EventBus'

import { addListener} from './service/listener'

import {
    HashRouter,
    Route,
    Link,
    Switch
} from 'react-router-dom'

import Login from './cmpt/login/index'
import Main from './cmpt/main'

import SetModal from './cmpt/more/ModalSet'

import { Icon, LocaleProvider } from 'antd';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


addListener()

function minus() {
    EventBus.emit('WINDOW_MIN');
}

function fullscreen() {
    EventBus.emit('WINDOW_FULLSCREEN');
}

function close() {
    EventBus.emit('WINDOW_CLOSE');
} 

ReactDOM.render(
        (<LocaleProvider locale={zh_CN}>
            <div>
                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/main" component={Main} />
                        <Route path="/setting" component={SetModal} />
                        <Route path="/about" component={SetModal} />
                    </Switch>
                </HashRouter>
            </div>
        </LocaleProvider>
        ),
    document.getElementById("app")
)
