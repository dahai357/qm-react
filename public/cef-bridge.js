var Bridge = function(){
    var runtimeMapping = {
        "AndroidInterface": "mobile",
        "PCInterface": "pc"
    }
    var bridgeInterface, runtime = "";
    for (var name in runtimeMapping) {
        if (name in window) {
            bridgeInterface = window[name];
            runtime = runtimeMapping[name];
            break;
        }
    }

    var o= {
        init:function(){
        },
        getRuntime: function () {
            return runtime;
        },
        callNative: function (){
            var number_of_params = arguments.length;
            var className = arguments[0];
            var methodName = arguments[1];
            var argLen = number_of_params - 2;
            switch(argLen){
                case 0:
                    return bridgeInterface.invokeMethod(className + "." + methodName);
                case 1:
                    bridgeInterface.printLog('==IcPlayer Player callNative: ' + className + "." + methodName + " arg=" + JSON.stringify(arguments[2]));
                    result = bridgeInterface.invokeMethod(className + "." + methodName, JSON.stringify(arguments[2]));
                    return JSON.parse(result);
                default:                    
                    break;
            }
        },
        callNativeAsync:function(){
            var number_of_params = arguments.length;
            var className = arguments[0];
            var methodName = arguments[1];
            var func = arguments[2];
            var callBack ;
            if(typeof func=="function"){
                callBack = o.addCallBackFunc(func);
                return bridgeInterface.invokeMethodAsync(className + "." + methodName, callBack);
            }
            else {
                var param = func;
                func = arguments[3];
                if(typeof func!="function"){
                    o.log("invalid call back func")
                    return;
                }
                callBack = o.addCallBackFunc(func);
                return bridgeInterface.invokeMethodAsync(className + "." + methodName, callBack, JSON.stringify(param));
            }
        },
        registerListener: function (eventName,func){
            o.log("register event for "+eventName);
            var key = o.addListenerFunc(eventName,func);
            var callBack ="Bridge.listenerInvokeFromNative('"+key+"',==param==)";
            bridgeInterface.registerListener(eventName, callBack);
            return key;
        },
        unRegisterListener: function(eventName,key){
            o.log("unRegister event for "+eventName);
            var callBack= "Bridge.listenerInvokeFromNative('"+key+"',==param==)";
            o.removeListenerFunc(key);
            bridgeInterface.unRegisterListener(eventName, callBack);
        },
        log: function (str){
            bridgeInterface.printLog(str)
        },
        takePhoto: function(){

        },
        goPage: function(index){
            bridgeInterface.prepareSwitchPage(JSON.stringify(index));
        },
        funcMap:{},
        listenerMap:{},
        listenerMapByEvent:{},
        listenerInvokeFromNative:function(callId,param){
            o.log("param="+param);
            var func = o.listenerMap[callId];
            if(func==undefined){
                o.log("call back func not found");
                o.listenerMap[callId] = null;
                return;
            }
            func(param);
        },
        callBackFromNative:function(callId,param){
            o.log("param="+param);
            var func = o.funcMap[callId];
            if(func==undefined){
                o.log("call back func not found");
                o.funcMap[callId] = null;
                return;
            }
            func(param);
            o.funcMap[callId] = null;
        },
        addListenerFunc: function(eventName,func){
            var key = o.randomkey(10);
            o.listenerMap[key] = func;
            return key;
            //return "Bridge.listenerInvokeFromNative('"+key+"',==param==)";
        },
        removeListenerFunc: function(key){
            delete o.listenerMap[key] ;
        },
        addCallBackFunc: function(func){
            var key = o.randomkey(10);
            o.funcMap[key] = func;
            return "Bridge.callBackFromNative('"+key+"',==param==)";
        },
        onPageLoaded: function(){
            bridgeInterface.onPageLoaded();
        },
        randomkey: function(l)  {
            var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
            var  tmp="";
            var timestamp = new Date().getTime();
            for(var  i=0;i<l;i++)  {
                tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
            }
            return  timestamp+tmp;
        }

    }
    return o;
}(); 
Bridge.init();

