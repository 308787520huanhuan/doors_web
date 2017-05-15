<template>
  <div class="orderDetail">
      <mt-header>
        <router-link to="/finance" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <div class="topCpntent">
          <span>订单号：{{parameter.sn}}</span>
          <span class="fr">物流号：</span>
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
        <!--收货人信息-->
        <div class="topCpntent consigneeContent">
          <span>{{parameter.consignee.name}}</span>
          <span class="fr">{{parameter.consignee.phone}}</span>
          <div class="address">
            {{parameter.consignee.address}}
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// import { MessageBox } from 'mint-ui'
// import { Indicator } from 'mint-ui'
export default {
  name: 'orderDetail',
  data () {
    return {
      order_id: '',
      token: '',
      parameter: ''
    }
  },
  methods: {
    // 请求订单详情
    getDetail: function () {
      this.$http.get('/v1/finance/order/' + this.order_id).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        this.parameter = res
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    }
  },
  created () {
    let href = location.href
    if (href.indexOf('?') !== -1) {
      let tlp = href.split('&')
      this.order_id = tlp[0].split('=')[1]
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
  text-align: left;
  padding-bottom: 50px;
}
.fr{
  float: right
}
.topCpntent{
  padding:5px 10px;
}
.operContent{
  position: fixed;
  bottom: 0;
  text-align: center;
  display: flex;
  width: 100%;
}
.operBtn{
  border-radius: 0;
  flex: 1;
}
.operBtnMore{
  margin-left: 10px;
}
.operBtnMore:last-child{
  margin-right: 10px;
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
.backgroundGray{
  background: #f9f9f9;
}
.consigneeContent{
  border-bottom: 1px solid #eee;
}
.tickeImg{
  height: 80px;
  margin-left: 80px;
}
</style>
