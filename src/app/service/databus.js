export default class DataBus {

    static instance = null;

    dataScope = null

    constructor() {
        this.dataScope = {};
    }

    static getInstance() {
        if (!!!DataBus.instance) {
            DataBus.instance = new DataBus();
        }

        return DataBus.instance;
    }

    setCacheData(key, val) {
        if (val == null) {
            delete this.dataScope[key];
        } else {
            this.dataScope[key] = val;
        }
    }

    setLocalData(key, val) {
        if (val == null) {
            localStorage.removeItem(key)
        } else {
            if (val instanceof Object) {
                localStorage.setItem(key, JSON.stringify(val));
            } else {
                localStorage.setItem(key, val);
            }
        }
    }

    getCacheData(key) {
        return this.dataScope[key];
    }

    getLocalData(key) {
        var val = localStorage.getItem(key)
        var obj = val;
        try {
            obj = JSON.parse(val)
        } catch (e) {
            obj = val;
        }
        return obj;
    }

    setSessionKey(key) {
        this.setLocalData('SESSION_KEY', key)
    }

    setUserKey(key) {
        this.setLocalData('USER_KEY', key)
    }   

    getSessionKey() {
        return this.getLocalData('SESSION_KEY')
    }

    getUserKey() {
        return this.getLocalData('USER_KEY')
    }
    

}

var DataBusInstance = DataBus.getInstance()

export {
    DataBusInstance
}