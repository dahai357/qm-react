var EventBus = require('../service/EventBus');
import $ from 'jquery';
function addListener() {


    EventBus.on('WINDOW_CLOSE', function () {
        try {
            CefUtils.sendNativeEvent('WINDOW_CLOSE', { n: 1 }, false)
        } catch (e) {
        }
    })

    EventBus.on('WINDOW_MIN', function () {
        try {
            CefUtils.sendNativeEvent('WINDOW_MIN', { n: 1 }, false)
        } catch (e) {
        }
    })

    EventBus.on('WINDOW_FULLSCREEN', function () {
        try {
            CefUtils.sendNativeEvent('WINDOW_MAX', { n: 1 }, false)
        } catch (e) {
        }
    })

    EventBus.on('OPEN_URL', function (URL) {
        try {
            CefUtils.sendNativeEvent('OPEN_URL', URL, false)
        } catch (e) {
        }
    })

    EventBus.on('USER_LOGIN_SYS', function (key) {        
        try {
            CefUtils.sendNativeEvent('USER_LOGIN_SYS', key, false)
        } catch (e) {
        }

    })

    EventBus.on('USER_LOGOUT_SYS', function () {
        try {
            CefUtils.sendNativeEvent('USER_LOGOUT_SYS', {}, false)
        } catch (e) {
        }
    })

    window.onload = function () {
        //注册接收事件
        try{
            var eventHandlers = {};
            eventHandlers["SHOW_SETTING_PAGE"] = function(a) {
                EventBus.emit('SYS_SHOW_SETTING');
            };
            CefUtils.addNativeEventListeners(eventHandlers); 
        }catch(e){}
        
    }
}

function initDrag() {
    var startX = -1;
    var startY = -1;
    var drag = $('.c-webkit-drag-region')
    drag.on('mousedown', function (e) { 
        startX = e.clientX;
        startY = e.clientY;
    })

    drag.on('mousemove', function (e) {
        if (startX >= 0 && startY >= 0) { 
            var offsetX = e.clientX - startX;
            var offsetY = e.clientY - startY;
            try {
                CefUtils.moveWindow(offsetX, offsetY)
            } catch (e) {
            }
        }
    })

    drag.on('mouseout', function (e) {
        startX = -1;
        startY = -1; 
    })

    drag.on('mouseup', function (e) {
        startX = -1;
        startY = -1; 
    })

}
module.exports = {
    addListener,
    initDrag
}