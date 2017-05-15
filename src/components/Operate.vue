<template>
  <div class="operate">
      <div class="main-wrapper">
        <!--tab-->
        <div class="tabContent">
          <mt-button size="normal" v-for="tab in tabs" :key="tab.num" :class="tab.num === active ? 'active':''" class="tabs" @click="clickTab(tab.num)" >{{tab.text}}</mt-button>
        </div>
        <!--tab over-->
        <!--商品管理-->
      <mt-tab-container v-model="activeContent">
        <!--订单管理-->
        <mt-tab-container-item id="0">
          <mt-loadmore :top-method="ordersLoadTop" :bottom-method="ordersLoadBottom" :bottom-all-loaded="ordersAllLoaded" :auto-fill="false" @top-status-change="ordersHandleTopChange" ref="ordersloadmore">
            <ul>
              <li v-if="ordersList.length == 0" style="padding:10px">
                暂无数据
              </li>
              <li v-for="order in ordersList" class="eachList">
                <router-link :to="{ name: 'OperateOrderDetail',query: {id: order.id, status: order_status}}">
                  <div class="topContent">
                      订单号：{{order.sn}}
                  </div>
                  <div class="middleContent">
                    <img :src="order.image"/>
                    <div class="rightPart">
                      <p>名称：{{order.goods_name}}</p>
                      <p>数量：{{order.quantity}}</p>
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
                </router-link>
              </li>
            </ul>
          </mt-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
      </div>
  </div>
</template>

<script>
export default {
  name: 'operate',
  data () {
    return {
      active: '1',
      activeContent: '0',
      order_status: 1, // 1待收货、 2待检验、3发货
      curPage: 1,
      ordersTopStatus: '', // 订单下拉状态
      ordersAllLoaded: false, // 订单是否全部加载完成
      ordersList: [],
      password: '',
      tabs: [
        {text: '待收货', num: '1'},
        {text: '待检验', num: '2'},
        {text: '待发货', num: '3'},
        {text: '已完成', num: '4'}
      ]
    }
  },
  methods: {
    // 切换tab
    clickTab: function (num) {
      // 状态切换
      // 先将禁止上拉解除
      this.ordersAllLoaded = false
      this.active = num
      this.order_status = num
      this.curPage = 1
      this.getOrdersList()
    },
    // 请求订单列表
    getOrdersList: function (type) {
      this.$http.get('/v1/quality/orders?' + 'order_status=' + this.order_status + '&page=' + this.curPage).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.rows.length === 0 && type === 'bottom') {
          this.ordersAllLoaded = true
        }
        // 请求成功后 如果页码是1 则先清空已有的数据
        if (this.curPage === 1) {
          this.ordersList.length = 0
        }
        this.ordersList.push(...res.rows)
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    ordersHandleTopChange: function (status) {
      this.ordersTopStatus = status
    },
    ordersLoadBottom: function () {
      this.curPage = this.curPage + 1
      this.getOrdersList('bottom')
      // 手动重置
      this.$refs.ordersloadmore.onBottomLoaded()
    },
    // 下拉刷新
    ordersLoadTop: function () {
      // 先将禁止上拉解除
      this.ordersAllLoaded = false
      // 页码置为1
      this.curPage = 1
      // 请求数据
      this.getOrdersList('top')
      // 手动重置
      this.$refs.ordersloadmore.onTopLoaded()
    }
  },
  created () {
    //
    this.getOrdersList()
  }
}
</script>

<style scoped>
.operate
{
  position:relative;
  width:100%;
  height:100%;
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
  width: 60px;
  height: 60px;
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
