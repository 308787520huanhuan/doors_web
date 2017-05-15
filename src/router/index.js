import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Index from '@/components/Index'
import Finance from '@/components/Finance'
import Operate from '@/components/Operate'
import Buyer from '@/components/Buyer'
import CServer from '@/components/CServer'
import AddGoods from '@/components/AddGoods'
import AddOrders from '@/components/AddOrders'
import OrderDetail from '@/components/OrderDetail'
import BuyerOrderDetail from '@/components/BuyerOrderDetail'
import OperateOrderDetail from '@/components/OperateOrderDetail'
import FinanceOrderDetail from '@/components/FinanceOrderDetail'
import PublishGoods from '@/components/PublishGoods'
import NoAccessRight from '@/components/NoAccessRight'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/public',
      name: 'PublishGoods',
      component: PublishGoods
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/finance',
      name: 'Finance',
      component: Finance
    },
    {
      path: '/operate',
      name: 'Operate',
      component: Operate
    },
    {
      path: '/buyer',
      name: 'Buyer',
      component: Buyer
    },
    {
      path: '/service',
      name: 'CServer',
      component: CServer
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/addGoods',
      name: 'AddGoods',
      component: AddGoods
    },
    {
      path: '/addOrders',
      name: 'AddOrders',
      component: AddOrders
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/buyerOrderDetail',
      name: 'BuyerOrderDetail',
      component: BuyerOrderDetail
    },
    {
      path: '/operateOrderDetail',
      name: 'OperateOrderDetail',
      component: OperateOrderDetail
    },
    {
      path: '/financeOrderDetail',
      name: 'FinanceOrderDetail',
      component: FinanceOrderDetail
    },
    {
      path: '/noAccessRight',
      name: 'NoAccessRight',
      component: NoAccessRight
    }
  ]
})
