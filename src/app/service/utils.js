import React from 'react'
var EventBus = require('../service/EventBus');
import { DataBusInstance } from '../service/databus'

var DeepCopy = function(source) { 
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? DeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

module.exports = {

    MoneytoFixed: function (num) {
        var money = num / 100;      
        return money.toFixed(2);
    },

    TimeFormat: function (t1, t2) {
        var today = new Date();
        var ts = new Date(t1 * 1000);
        var te = new Date(t2 * 1000);
        var ret = '';
        var over = false;
        if(t1==0){
            ret='其它时间';
        }else{
            if ((today.getTime() / 1000) > t2) {
                over = true;
            }
            if (today.getDate() == ts.getDate()
                && today.getMonth() == ts.getMonth()
                && today.getFullYear() == ts.getFullYear()) { // 当日
                var m = ts.getMinutes();
                var h1 = ts.getHours();
                var st = (h1 < 10 ? ('0' + h1) : h1) + ":" + (m < 10 ? '0' + m : '' + m);
                var m1 = te.getMinutes();
                var h2 = te.getHours();
                var et =  (h2 < 10 ? ('0' + h2) : h2) + ":" + (m1 < 10 ? '0' + m1 : '' + m1);
                ret = '今天 ' + st + ' - ' + et;
            } else {
                if (today.getFullYear() == ts.getFullYear()) {
                    var m = ts.getMinutes();
                    var h1 = ts.getHours();
                    var d = ts.getDate();
                    var month = (ts.getMonth() + 1) ;
                    var st = (month < 10 ? ('0' + month) : month) + '-' + (d < 10 ? ('0' + d) : d)  + ' ' +(h1 < 10 ? ('0' + h1) : h1) + ":" + (m < 10 ? '0' + m : '' + m);
                    var m1 = te.getMinutes();
                    var h2 = te.getHours();
                    var et =  (h2 < 10 ? ('0' + h2) : h2) + ":" + (m1 < 10 ? '0' + m1 : '' + m1);
                    ret = st + ' - ' + et;
                } else {
                    var m = ts.getMinutes();
                    var d = ts.getDate();
                    var h1 = ts.getHours();
                    var month = (ts.getMonth() + 1) ;
                    var st = ts.getFullYear() + '-' + (month < 10 ? ('0' + month) : month)+ '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h1 < 10 ? ('0' + h1) : h1)  + ":" + (m < 10 ? '0' + m : '' + m);
                    var m1 = te.getMinutes();
                    var h2 = te.getHours();
                    var et = (h2 < 10 ? ('0' + h2) : h2) + ":" + (m1 < 10 ? '0' + m1 : '' + m1);
                    ret = st + ' - ' + et;
                }
            }
            if (over) {
                return <span className="colory-c-t">{ret}</span>;
            }
        }
        return ret;
    },

    SingleTimeFormat: function (t1) {
        var today = new Date();
        var ts = new Date(t1 * 1000);
        var ret = '';
        if(t1==0){
            ret='其它时间';
        }else{
            if (today.getDate() == ts.getDate()
                && today.getMonth() == ts.getMonth()
                && today.getFullYear() == ts.getFullYear()) { // 当日
                var m = ts.getMinutes();
                var s = ts.getSeconds();
                var h = ts.getHours();
                var st = (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? '0' + m : '' + m)
                ret = '今天 ' + st;
            } else {
                if (today.getFullYear() == ts.getFullYear()) {
                    var m = ts.getMinutes();
                    var d = ts.getDate();
                    var h = ts.getHours();
                    var month = (ts.getMonth() + 1) ;
                    var st = (month < 10 ? ('0' + month) : month) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m)
                    ret = st
                } else {
                    var m = ts.getMinutes();
                    var d = ts.getDate();
                    var h = ts.getHours();
                    var month = (ts.getMonth() + 1) ;
                    var st = ts.getFullYear() + '-' +(month < 10 ? ('0' + month) : month) + '-' + (d < 10 ? ('0' +d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m)
                    ret = st
                }
            }
        }
        return <span className="colory-c-t">{ret}</span>;
    },
    
     DeepCopy :function(source) { 
        return DeepCopy(source);
        
     },

    TimeFormatFull: function (t1) {
        var ts = new Date(t1 * 1000);
        var ret = '';            
        var m = ts.getMinutes();
        var d = ts.getDate();
        var h = ts.getHours();
        var s = ts.getSeconds();
        var month = (ts.getMonth() + 1) ;
        var st = ts.getFullYear() + '-' +(month < 10 ? ('0' + month) : month) + '-' + (d < 10 ? ('0' +d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s)
        ret = st 
        return <span className="colory-c-t">{ret}</span>;
    },

    UpdateMenuNum:function(type,total){
        var old = DataBusInstance.getSessionKey();        
        if(old[type] != total){
            old[type] = total;
            DataBusInstance.setSessionKey(old);
            EventBus.emit('TOTAL_CHANGED', old);
        }            
    },

    Multiply:function(a, b){
        let m = 0,    
        c = a.toString(),    
        d = b.toString();    
        try {    
            m += c.split(".")[1].length
    
        } catch(e) {}    
        try {    
            m += d.split(".")[1].length
    
        } catch(e) {}    
        return Number(c.replace(".", "")) * Number(d.replace(".", "")) / Math.pow(10, m)    
    }

}