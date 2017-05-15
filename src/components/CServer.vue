<template>
  <div class="service">
      <!--<mt-header title="客服中心">
        <router-link to="/login" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>-->
      <div class="tabContent">
        <mt-button size="normal" v-for="tab in tabs" :key="tab.num" :class="tab.num === active ? 'active':''" class="tabs" @click="clickTab(tab.num)" >{{tab.text}}</mt-button>
      </div>
      <!--商品管理-->
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="0">
          <div class="addSwap">
            <router-link :to="{ name: 'AddGoods'}">
              <mt-button type="primary" size="small" class="add">+ 添加商品</mt-button>
            </router-link>
          </div>
          <mt-loadmore :top-method="goodsLoadTop" :bottom-method="goodsLoadBottom" :bottom-all-loaded="goodsAllLoaded" :auto-fill="false" @top-status-change="goodsHandleTopChange" ref="goodsloadmore">
            <ul>
              <li v-for="good in goodsList" class="eachList">
                <div class="topContent">
                    商品ID：{{good.id}}
                </div>
                <div class="middleContent">
                  <img :src="good.icon"/>
                  <div class="rightPart">
                    <p>编号：{{good.code}}</p>
                    <p>名称：{{good.name}}</p>
                    <p v-if="good.status == 1">
                      状态：<span class="green">在售</span>
                    </p>
                    <p v-if="good.status == 2">
                      状态：<span class="red">已下架</span>
                    </p>
                  </div>
                </div>
                <div class="middleContent">
                  <router-link :to="{ name: 'AddGoods', query:{id: good.id}}">
                    <mt-button size="small" class="opers" @click="" >编辑商品</mt-button>
                  </router-link>
                  <mt-button size="small" class="opers" @click="soldOut(good.id)" type="danger" v-if="good.status == 1">下架商品</mt-button>
                  <router-link :to="{ name: 'AddOrders', query: {id: good.id}}" v-if="good.status == 1">
                      <mt-button size="small" class="opers" @click="" >创建订单</mt-button>
                  </router-link>
                </div>
              </li>
              <!--<li v-for="n in 10">{{n}}</li>-->
            </ul>
          </mt-loadmore>
        </mt-tab-container-item>
        <!--订单管理-->
        <mt-tab-container-item id="1">
          <div class="addSwap">
            <router-link :to="{ name: 'AddOrders'}">
              <mt-button type="primary" size="small" class="add">+ 创建订单</mt-button>
            </router-link>
          </div>
          <mt-loadmore :top-method="ordersLoadTop" :bottom-method="ordersLoadBottom" :bottom-all-loaded="ordersAllLoaded" :auto-fill="false" @top-status-change="ordersHandleTopChange" ref="ordersloadmore">
            <ul>
              <li v-if="ordersList.length == 0" style="padding:10px">
                暂无数据
              </li>
              <li v-for="order in ordersList" class="eachList">
                <router-link :to="{ name: 'OrderDetail',query: {id: order.id}}">
                  <div class="topContent">
                      <p>订单号：{{order.sn}}</p>
                      <p>下单时间：{{order.add_time}}</p>
                  </div>
                  <div class="middleContent">
                    <img :src="order.image"/>
                    <div class="rightPart">
                      <p>数量：{{order.quantity}}</p>
                      <p v-if="order.order_status == 0">
                        订单状态：已取消
                      </p>
                      <p v-if="order.order_status == 1">
                        订单状态：<span class="red">待付款</span>
                      </p>
                      <p v-if="order.order_status == 2">
                        订单状态：<span class="blue">待发货</span>
                      </p>
                      <p v-if="order.order_status == 3">
                        订单状态：<span class="green">已发货</span>
                      </p>
                      <p v-if="order.order_status == 4">
                        订单状态：<span class="green">完成</span>
                      </p>
                      <p v-if="order.purchaser_status == 0">
                        买手状态：<span class="blue">还未接受</span>
                      </p>
                      <p v-if="order.purchaser_status == 1">
                        买手状态：<span class="red">已拒绝</span>
                      </p>
                      <p v-if="order.purchaser_status ==2">
                        买手状态：<span class="green">已接受</span>
                      </p>
                    </div>
                  </div>
                  <div class="bottomContent">
                    <span class="green">已付款：{{order.amount_paid}}.00元</span>
                    <span class="red fr">未付款：{{order.amount_payable - order.amount_paid}}.00元</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </mt-loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <mt-loadmore :top-method="pLoadTop" :bottom-method="pLoadBottom" :bottom-all-loaded="pAllLoaded" :auto-fill="false" @top-status-change="pHandleTopChange" ref="ploadmore">
            <ul>
              <li v-for="order in pList" class="eachList">
                <div class="middleContent">
                  <img :src="order.image"/>
                  <div class="rightPart">
                    <p>数量：{{order.quantity}}</p>
                    <p>买手：{{order.buyer.name}}</p>
                    <p v-if="order.order_status == 0">
                      状态：已取消
                    </p>
                    <p v-if="order.order_status == 1">
                      状态：<span class="red">待付款</span>
                    </p>
                    <p v-if="order.order_status == 2">
                      状态：<span class="blue">待发货</span>
                    </p>
                    <p v-if="order.order_status == 3">
                      状态：<span class="green">已发货</span>
                    </p>
                    <p v-if="order.order_status == 4">
                      状态：<span class="green">完成</span>
                    </p>
                    <p>下单时间：{{order.add_time}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </mt-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'service',
  data () {
    return {
      active: '0',
      goodsCurPage: 1, // 商品列表的当前页面
      goodsList: [], // 商品列表
      goodsTopStatus: '', // 下拉状态
      goodsAllLoaded: false, // 是否全部加载完成
      ordersCurPage: 1, // 订单列表的当前页面
      ordersList: [], // 订单列表
      ordersTopStatus: '', // 订单下拉状态
      ordersAllLoaded: false, // 订单是否全部加载完成
      pCurPage: 1, // 订单列表的当前页面
      pList: [], // 订单列表
      pTopStatus: '', // 订单下拉状态
      pAllLoaded: false, // 订单是否全部加载完成
      tabs: [
        {text: '商品管理', num: '0'},
        {text: '订单管理', num: '1'},
        {text: '礼包服务', num: '2'}
      ]
    }
  },
  methods: {
    // 切换tab
    clickTab: function (num) {
      // tab选中状态
      this.active = num
    },
    goodsHandleTopChange: function (status) {
      this.goodsTopStatus = status
    },
    goodsLoadBottom: function () {
      this.goodsCurPage = this.goodsCurPage + 1
      this.getGoodsList('bottom')
      // 手动重置
      this.$refs.goodsloadmore.onBottomLoaded()
    },
    // 下拉刷新
    goodsLoadTop: function () {
      // 先将禁止上拉解除
      this.goodsAllLoaded = false
      // 页码置为1
      this.goodsCurPage = 1
      // 请求数据
      this.getGoodsList('top')
      // 手动重置
      this.$refs.goodsloadmore.onTopLoaded()
    },
    // 请求商品列表
    getGoodsList: function (type) {
      this.$http.get('/v1/manage/goods/list?' + 'page=' + this.goodsCurPage).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.rows.length === 0 && type === 'bottom') {
          this.goodsAllLoaded = true
        }
        // 请求成功后 如果页码是1 则先清空已有的数据
        if (this.goodsCurPage === 1) {
          this.goodsList.length = 0
        }
        this.goodsList.push(...res.rows)
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 下架商品
    soldOut: function (id) {
      MessageBox.confirm('确定下架该商品?').then(action => {
        this.$http.put('/v1/manage/goods/' + id + '/sale/stop', {token: this.$cookies.get('session')}).then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            location.reload()
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      })
    },
    ordersHandleTopChange: function (status) {
      this.ordersTopStatus = status
    },
    ordersLoadBottom: function () {
      this.ordersCurPage = this.ordersCurPage + 1
      this.getOrdersList('bottom')
      // 手动重置
      this.$refs.ordersloadmore.onBottomLoaded()
    },
    // 下拉刷新
    ordersLoadTop: function () {
      // 先将禁止上拉解除
      this.ordersAllLoaded = false
      // 页码置为1
      this.ordersCurPage = 1
      // 请求数据
      this.getGoodsList('top')
      // 手动重置
      this.$refs.ordersloadmore.onTopLoaded()
    },
    // 请求商品列表
    getOrdersList: function (type) {
      this.$http.get('/v1/manage/orders?' + 'order_status=0' + '&page=' + this.ordersCurPage).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.rows.length === 0 && type === 'bottom') {
          this.ordersAllLoaded = true
        }
        // 请求成功后 如果页码是1 则先清空已有的数据
        if (this.ordersCurPage === 1) {
          this.ordersList.length = 0
        }
        this.ordersList.push(...res.rows)
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    pHandleTopChange: function (status) {
      this.pTopStatus = status
    },
    pLoadBottom: function () {
      this.pCurPage = this.pCurPage + 1
      this.getPList('bottom')
      // 手动重置
      this.$refs.ploadmore.onBottomLoaded()
    },
    // 下拉刷新
    pLoadTop: function () {
      // 先将禁止上拉解除
      this.pAllLoaded = false
      // 页码置为1
      this.pCurPage = 1
      // 请求数据
      this.getGoodsList('top')
      // 手动重置
      this.$refs.ploadmore.onTopLoaded()
    },
    // 请求商品列表
    getPList: function (type) {
      this.$http.get('/v1/manage/orders?' + 'order_status=6' + '&page=' + this.pCurPage).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.rows.length === 0 && type === 'bottom') {
          this.pAllLoaded = true
        }
        // 请求成功后 如果页码是1 则先清空已有的数据
        if (this.pCurPage === 1) {
          this.pList.length = 0
        }
        this.pList.push(...res.rows)
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    }
  },
  created () {
    // 初始化成功之后先请求商品列表
    this.getGoodsList()
    //
    this.getOrdersList()

    this.getPList()
  }
}
</script>

<style scoped>
.service
{
  position:relative;
  width:100%;
  height:100%;
}
.service-wrapper
{
    box-sizing: border-box;
    padding: 0 20px;
    top: 50%;
    position: absolute;
    width: 100%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.list
{
    margin-bottom:10px;
}
.tabs{
  box-shadow:none;
  border:1px solid #eee;
  border-radius:0;
  flex:1;
}
.tabContent{
  /*margin-top: 6px;*/
  display:flex;
}
.tabs.active{
  background:#26a2ff;
  color:#fff;
}
.addSwap{
  /*width:100%;
  float:left;*/
  text-align:left;
  padding:10px;
}
.mint-loadmore{
  font-size: 16px;
}
/**列表**/
.eachList{
  text-align: left;
  padding:10px;
  border-top: 1px solid #eee;
}
.topContent{
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.bottomContent{
  border-top: 1px solid #eee;
  padding-top: 5px;
  font-size: 13px;
}
.fr{
  float: right
}
.middleContent{
  padding: 5px 0;
  font-size: 14px;
  display: flex;
  color: #555;
}
.middleContent > img{
  margin-right: 10px;
  width: 80px;
  height: 80px;
  display: block;
}
.middleContent > .rightPart{
  flex: 2;
}
.opers{
  margin-right: 10px;
}
.green{
  color: green
}
.red{
  color: red
}
.blue{
  color: #26a2ff
}
</style>
