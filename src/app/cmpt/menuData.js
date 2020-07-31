import IconAllOrderSelected from './imgs/icon-all.png';
import IconDaijieSelected from './imgs/icon-daijie.png';
import IconPeisongSelected from './imgs/icon-peisong.png';
import IconZitiSelected from './imgs/icon-ziti.png';
import IconAllOrder from './imgs/icon-all-gray.png';
import IconDaijie from './imgs/icon-daijie-gray.png';
import IconPeisong from './imgs/icon-peisong-gray.png';
import IconZiti from './imgs/icon-ziti-gray.png';

import IconPay from './imgs/icon-pay.png'
import IconPaySelected from './imgs/icon-pay-orange.png'

import IconOrder from './imgs/icon-order-gray.png';
import IconOrderSelected from './imgs/icon-order.png';

import IconShouhou from './imgs/icon-shouhou-gray.png';
import IconShouhouSelected from './imgs/icon-shouhou.png';

import IconKucun from './imgs/icon-kucun-gray.png';
import IconKucunSelected from './imgs/icon-kucun.png';

import IconOrderCancel from './imgs/icon-order-cancel-gray.png';
import IconOrderCancelSelected from './imgs/icon-order-cancel.png';

import IconOrderDada from './imgs/icon-dada.png';
import IconOrderDadaSelected from './imgs/icon-dada-orange.png';

//头部路由子路由的数据结构
/**
 *      *  "waitReceiveCount":0,
        "waitDeliveryCount":1,
        "waitGetCount":0,
        "orderCount":1,
        "waitRefundProccessCount":0,
        "waitRefundReceiveCount":14,
        "refundCount":14,
        "alertCount":0
 */
export default [
    {
        id: 1,//tab id，用于区分点击的tab
        name: '订单管理',//tab名称
        selected: true,//tab是否被选中
        img: IconOrder,//未选中状态下的图片
        selectedimg: IconOrderSelected,//选中状态下的图片
        num: 0,//tab上面的数量
        key:'orderCount',
        url: '/main',//tab对应的路由
        //tab对应的子路由
        children: [
            {
                id: 11,
                name: '全部订单',
                selected: true,
                num: 0,
                img: IconAllOrder,
                key:'',
                selectedimg: IconAllOrderSelected,
                url: '/main',
            },
            {
                id: 12,
                name: '待接单',
                selected: false,
                num: 0,
                img: IconDaijie,
                key:'waitReceiveCount',
                selectedimg: IconDaijieSelected,
                url: '/main/ordermanager/receive',
            },
            {
                id: 13,
                name: '待配送',
                selected: false,
                num: 0,
                img: IconPeisong,
                key:'waitDeliveryCount',
                selectedimg: IconPeisongSelected,
                url: '/main/ordermanager/peisong',
            },
            {
                id: 14,
                name: '达达配送',
                selected: false,
                num: 0,
                img: IconOrderDada,
                key:'dadaCount',
                selectedimg: IconOrderDadaSelected,
                url: '/main/ordermanager/dada',
            },
            {
                id: 15,
                name: '待自提',
                selected: false,
                num: 0,
                img: IconZiti,
                key:'waitGetCount',
                selectedimg: IconZitiSelected,
                url: '/main/ordermanager/ziti',
            },  {
                id: 16,
                name: '取消待确认',
                selected: false,
                num: 0,
                img: IconOrderCancel,
                key:'waitCancelProccessCount',
                selectedimg: IconOrderCancelSelected,
                url: '/main/ordermanager/cancel',
            }, {
                id: 17,
                name: '待付款',
                selected: false,
                num: 0,
                img: IconPay,
                selectedimg: IconPaySelected,
                url: '/main/ordermanager/pay',
            }
        ]
    },
    {
        id: 2,
        name: '售后管理',
        selected: false,
        img: IconShouhou,
        key:'refundCount',
        selectedimg: IconShouhouSelected,
        num: 0,
        url: '/main/shouhou/all',
        children: [
            {
                id: 21,
                name: '全部订单',
                num: 0,
                selected: true,
                key:'',
                img: IconAllOrder,
                selectedimg: IconAllOrderSelected,
                url: '/main/shouhou/all',
            },
            {
                id: 22,
                name: '待处理',
                selected: false,
                num: 0,
                img: IconDaijie,
                key:'waitRefundProccessCount',
                selectedimg: IconDaijieSelected,
                url: '/main/shouhou/manage',
            },
            {
                id: 23,
                name: '待收货',
                selected: false,
                num: 0,
                img: IconPeisong,
                key:'waitRefundReceiveCount',
                selectedimg: IconPeisongSelected,
                url: '/main/shouhou/receive',
            }
        ]
    },
    {
        id: 3,
        name: '库存管理',
        selected: false,
        img: IconKucun,
        key:'alertCount',
        num: 0,
        selectedimg: IconKucunSelected,
        url: '/main/kucun/all',
        children: [
            {
                id: 31,
                name: '库存预警',
                selected: true,
                num: 0,
                img: IconAllOrder,
                key:'alertCount',
                selectedimg: IconAllOrderSelected,
                url: '/main/kucun/all',
            }
        ]
    }
]