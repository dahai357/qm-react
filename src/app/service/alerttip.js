var EventBus = require('../service/EventBus');

import loginApi from '../api/loginApi'

import { DataBusInstance } from '../service/databus'

import Version from '../../../version'
export default class AlertTip {
  ws_url = Version().ws_url;
  key; 
  timer;
  time_old = null;
  time_new = null;
  time_dif = null;
  constructor() {

  }  

  reconnectSocket(type){ 
    var self = this;   
    self.key = self.key || DataBusInstance.getSessionKey().key;
    clearTimeout(self.timer);
    if(type == 'noTimer'){     
     self.createSocket(self.key, true);
    }else{ 
      if(!self.time_old&& typeof(self.time_old)!="undefined" && self.time_old!=0){
        self.time_old = (new Date()).getTime(); 
      }else{
        self.time_new = (new Date()).getTime();
        self.time_dif = self.time_new - self.time_old;        
      }
      if(self.time_dif > 600000){
        self.timer = setTimeout(function () {                 
          self.createSocket(self.key, true);       
        }, 1800000);
      }else{        
          self.timer = setTimeout(function () { 
            self.createSocket(self.key, true);       
          }, 30000);
      } 
    }      
  }  

  createSocket(key, reconnect) {    
    let self = this;
    self.key = key;     
    this.Socket = new WebSocket(this.ws_url); // 建立 web socket 连接成功触发事件    
    this.Socket.onopen = function (ws) {  
      self.time_old = null;
      self.time_new = null;
      self.time_dif = null; 
      self.reFlag = true; 
      EventBus.emit('OFF_NET', 0);      
      // 使用 send() 方法发送数据 
      try {
        var msg = { "method": "join", "key": key };
        self.Socket.send(JSON.stringify(msg))
      } catch (e) {  }     
    }
    // 接收服务端数据时触发事件
    this.Socket.onmessage = function (evt) { 
      var received_msg = evt.data;     
      var msg = JSON.parse(received_msg);      
      if (msg.method == 'fromMsg') {
        self.resetNum(msg.data)        
      } else if (msg.method == 'connection') {

      } else if (msg.method == 'login') {
        if (reconnect) {   
          try { 
            loginApi.count().then(function (res) { 
              var datas = res.responseContent;
              var old = DataBusInstance.getSessionKey();
              Object.assign(old, datas);
              DataBusInstance.setSessionKey(old)             
              EventBus.emit('TOTAL_CHANGED', old) 
            })
          } catch (e) {               
          }
        }
      }
    };

    // 断开 web socket 连接成功触发事件
    this.Socket.onclose = (err) => {       
      EventBus.emit('OFF_NET', 1);
      self.reconnectSocket();
    };

    this.Socket.onerror = (err) => {     
     self.reconnectSocket();
    };
  }

  /**
   *  *      *  "waitReceiveCount":0,
        "waitDeliveryCount":1,
        "waitGetCount":0,
        "orderCount":1,
        "waitRefundProccessCount":0,
        "waitRefundReceiveCount":14,
        "refundCount":14,
        "alertCount":0
   * @param {*} msg 
   */
  resetNum(msg) {    
    if (msg.type == 101 || msg.type == 102 || msg.type==35 || msg.type==108) {          
      var old = DataBusInstance.getSessionKey();       
      old['waitReceiveCount'] += msg['waitReceiveCount']
      old['waitDeliveryCount'] += msg['waitDeliveryCount']
      old['waitGetCount'] += msg['waitGetCount']
      old['waitCancelProccessCount'] += msg['waitCancelProccessCount']
      old['orderCount'] += msg['orderCount']
      old['waitRefundProccessCount'] += msg['waitRefundProccessCount']
      old['waitRefundReceiveCount'] += msg['waitRefundReceiveCount']
      old['refundCount'] += msg['refundCount']        
      DataBusInstance.setSessionKey(old)
      EventBus.emit('TOTAL_CHANGED', old)
      if (msg['waitReceiveCount'] > 0) {
        EventBus.emit('NEW_ORDER_TIP')
      }
      if (msg['waitCancelProccessCount'] > 0) {
        EventBus.emit('PLAY_AUDIO_CANCEL')
      }
      if (msg.params && msg.params['orderId']) {
        var orderId = msg.params['orderId'];
        EventBus.emit('RELOAD_ORDER_' + orderId)
      } else if (msg.params && msg.params['refundId']) {
        var refundId = msg.params['refundId'];
        EventBus.emit('RELOAD_REFUND_' + refundId)
      }
      if (msg.type == 108) {
        //1.4.0自动接单
        EventBus.emit('NEW_ORDER_TIP',true)
      }
    }
    if (msg.type == 107) {
      EventBus.emit('USER_LOGOUT','relogin')
    }

    if(msg.soundType){
      switch(msg.soundType) {
        case 1:
          EventBus.emit('PLAY_AUDIO_ClOSE');
          break;
        case 2:
          EventBus.emit('PLAY_AUDIO_AUTO_ClOSE');
          break;
      }
    }

  }
}