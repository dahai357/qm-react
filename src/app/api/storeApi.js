import api from './api'
import { DataBusInstance } from '../service/databus'

class StoreWarnApi {

    constructor() {

    }

    /**
     *shopkeeper/warning
     */
    getWarningList(page) {
        var url = 'shopkeeper/warning';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            pageSize: 15,
            pageIndex: page - 1 || 0
        }
        return api.post(url, p);
    }

    /**
     * shopkeeper/addStock
     * set:设置(设置预警值为0) add:为添加(增补库存)
     */
    addStock(goodsId, num , type) {
        var url = 'shopkeeper/addStock';
        var p = {
            key: DataBusInstance.getSessionKey().key,
            goodsId:goodsId,
            num:num,
            type:type
        }
        return api.post(url, p, {sucTip:true});
    }

}

module.exports = new StoreWarnApi();