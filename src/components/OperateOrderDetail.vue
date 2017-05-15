<template>
  <div class="orderDetail">
      <mt-header>
        <router-link to="/operate" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <div class="topCpntent">
          <span>订单号：{{parameter.sn}}</span>
          <span class="fr">物流号：{{parameter.tracking_number}}</span>
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
        <!--只有在状态3下才显示的快递信息-->
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
        <!--只有在状态3下才显示的快递信息-->
        <div class="status3" v-if="order_status == 3">
          <mt-field label="快递公司" placeholder="请输入快递公司名称" v-model="express"></mt-field>
          <mt-field label="快递单号" placeholder="请输入快递单号" v-model="number"></mt-field>
        </div>
        <!--操作按钮-->
        <div class="operContent">
          <mt-button type="primary" size="large" v-on:click="receive()" v-if="order_status == 1" class="operBtn">确定收货</mt-button>
          <mt-button type="primary" size="normal" v-on:click="noPass()" v-if="order_status == 2" class="operBtn operBtnMore">不通过</mt-button> 
          <mt-button type="primary" size="normal" v-on:click="pass()" v-if="order_status == 2" class="operBtn operBtnMore">检验合格</mt-button>
          <mt-button type="primary" size="large" v-on:click="sendGoods()" v-if="order_status == 3" class="operBtn">发货</mt-button>
        </div>
      </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
// import { Indicator } from 'mint-ui'
export default {
  name: 'orderDetail',
  data () {
    return {
      order_id: '',
      express: '', // 快递公司
      number: '', // 快递单号
      order_status: '',
      parameter: '',
      consignees: []
    }
  },
  methods: {
    // 请求订单详情
    getDetail: function () {
      this.$http.get('/v1/quality/order/' + this.order_id).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        this.parameter = res
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 获取运营地址列表
    getConsignees: function () {
      this.$http.get('/v1/purchasers/quality/consignees').then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        this.consignees = res
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 接单
    receive: function () {
      MessageBox.confirm('确定已经收到货物?').then(action => {
        this.$http.put('/v1/quality/order/' + this.order_id + '/get_package').then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Operate'})
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      })
    },
    // 不合格
    noPass: function () {
      MessageBox.confirm('确定该货物不合格?').then(action => {
        this.$http.put('/v1/quality/order/' + this.order_id + '/verify_fail').then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Operate'})
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      })
    },
    // 合格
    pass: function () {
      MessageBox.confirm('确定该货物合格?').then(action => {
        this.$http.put('/v1/quality/order/' + this.order_id + '/verify_ok').then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Operate'})
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      })
    },
    // 发货
    sendGoods: function () {
      if (this.express === '') {
        this.$toast('请填写快递公司名称')
      } else if (this.number === '') {
        this.$toast('请填写快递单号')
      } else {
        let para = {}
        para.token = this.$cookies.get('session')
        // para.qa_id = this.userId
        para.express_company = this.express
        para.tracking_number = this.number
        this.$http.put('/v1/quality/order/' + this.order_id + '/deliver', para).then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Operate'})
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      }
    }
  },
  created () {
    let href = location.href
    if (href.indexOf('?') !== -1) {
      let tlp = href.split('&')
      this.order_id = tlp[0].split('=')[1]
      this.order_status = tlp[1].split('=')[1]

      // 如果是状态3 才请求地址列表
      // this.getConsignees();
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
