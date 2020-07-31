var environment = 'hd', // 'test':测试站, 'hd':预发布, 'official':正式站
host = 106, // 106: 106 环境, 145: 145 环境
resourceGrop={};

if(environment == 'test'){
    resourceGrop = {
        ws_url:'wss://apiceshi.shenbd.com/wss',
        api_url:'http://apitest.shenbd.com/client/',
        site_url:'http://testadmin.shenbd.com/mall/index.php'
    }
    if( host == 145){
        resourceGrop.ws_url = 'wss://192.168.1.145:9502';
    } 
}else if(environment == 'hd'){
    resourceGrop = {
        ws_url:'wss://wsshd.shenbd.com',
        api_url:'http://apihd.shenbd.com/client/',
        site_url: 'http://hd.shenbd.com/mall/index.php'
    }
}else{
    resourceGrop = {
        ws_url:'wss://api.shenbd.com/wss',
        api_url:'https://api.shenbd.com/client/',
        site_url: 'https://b.shenbd.com/mall/index.php'
    }
}

module.exports = function () {
    return {
        v_code: 140,
        v_label: '1.4.0',
        v_support:'win7', // xp  win7      
        ws_url: resourceGrop.ws_url,        
        api_url: resourceGrop.api_url,
        site_url: resourceGrop.site_url
    }  
}

