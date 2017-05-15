<template>
  <div class="orderDetail">
      <mt-header>
        <router-link to="/service" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <div class="topCpntent">
          <span>订单号：{{parameter.sn}}</span>
          <span class="fr" v-if="parameter.order_status == 1" @click="cancel()">取消订单</span>
        </div>
        <div class="topCpntent">
          <span v-if="parameter.order_status == 0">状态：已取消</span>
          <span v-if="parameter.order_status == 1">状态：待付款</span>
          <span v-if="parameter.order_status == 2">状态：待发货</span>
          <span v-if="parameter.order_status == 3">状态：已发货</span>
          <span v-if="parameter.order_status == 4">状态：完成</span>
        </div>
        <div class="topCpntent">
          <span>备注：{{parameter.remark}}</span>
        </div>
        <div class="topCpntent consigneeContent">
          <span>{{parameter.consignee.name}}</span>
          <span class="fr">{{parameter.consignee.phone}}</span>
          <div class="address">
            {{parameter.consignee.address}}
          </div>
        </div>
        <ul>
          <li class="eachList backgroundGray">
            <img :src="parameter.goods.image"/>
            <div class="rightPart">
              <p>名称：{{parameter.goods.name}}</p>
              <p>数量：{{parameter.goods.quantity}}</p>
            </div>
          </li>
        </ul>
        <div class="red">
          总价：{{parameter.amount_payable}}.00元
        </div>
        <div class="red">
          实付款：{{parameter.amount_paid}}.00元
        </div>
        <div class="topCpntent address" style="text-align:right">
          下单时间：2017-04-25
        </div>
        <div class="logContent backgroundGray topCpntent">
          <h4 class="topCpntent">物流信息</h4>
          <div class="logicList topCpntent backgroundGray">
            <div class="each" v-for="log in parameter.logistics">
              <p>{{log.remark}}</p>
              <div class="address">
                {{log.send_time}}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'orderDetail',
  data () {
    return {
      order_id: '',
      parameter: ''
    }
  },
  methods: {
    // 请求订单详情
    getDetail: function () {
      this.$http.get('/v1/manage/order/' + this.order_id).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        this.parameter = res
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 取消订单
    cancel: function () {
      MessageBox.confirm('确定取消该订单?').then(action => {
        this.$http.put('/v1/manage/order/' + this.order_id + '/cancel', {token: this.$cookies.get('session')}).then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            location.reload()
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      })
    }
  },
  created () {
    let href = location.href
    if (href.indexOf('?') !== -1) {
      this.order_id = href.split('=')[1]
    }

    // 请求订单详情
    this.getDetail()
  }
}
</script>

<style scoped>
.orderDetail
{
  position:relative;
  width:100%;
  height:100%;
}
.main-wrapper{
  text-align: left
}
.fr{
  float: right
}
.topCpntent{
  padding:5px 10px;
}
.address{
  color: #888;
  margin-top: 5px;
}
/**列表**/
.eachList{
  text-align: left;
  padding:10px;
  display: flex;
  border-bottom: 1px solid #eee;
}
.eachList img{
  widows: 60px;
  height: 60px;
  margin-right: 10px;
  vertical-align: middle
}
.font14 span{
  font-size: 14px !important;
}
.red{
  text-align: right;
  color: red;
  margin:5px 10px 0 0;
}
.backgroundGray{
  background: #f9f9f9;
}
.consigneeContent{
  border: 1px solid #eee;
  border-right: none;
  border-left: none;
}
</style>
