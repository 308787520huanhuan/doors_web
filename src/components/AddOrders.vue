<template>
  <div class="addOrders">
      <mt-header>
        <router-link to="/service" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <h3>购买信息</h3>
        <mt-field label="购买人姓名" placeholder="请输入购买人姓名" v-model="parameter.user_name"></mt-field>
        <mt-field label="购买人电话" placeholder="请输入购买人电话" v-model="parameter.user_phone"></mt-field>
        <h3>收货信息</h3>
        <mt-field label="收货人姓名" placeholder="请输入收货人姓名" v-model="parameter.consignee"></mt-field>
        <mt-field label="收货人电话" placeholder="请输入收货人电话" v-model="parameter.consignee_phone"></mt-field>
        <mt-field label="收货人地址" placeholder="请输入收货人地址" v-model="parameter.consignee_address"></mt-field>
        <h3>商品信息</h3>
        <mt-field label="商品ID" placeholder="请输入商品ID" v-model="parameter.goods_id" :readonly="disabled" :disableClear="disabled"></mt-field>
        <mt-field label="商品数量" placeholder="请输入商品数量" v-model="parameter.goods_num"></mt-field>
        <mt-field label="商品价格" placeholder="请输入商品价格" v-model="parameter.deal_price"></mt-field>
        <mt-field label="备注" placeholder="" v-model="parameter.remark"></mt-field>
        <!--品牌列表-->
        <a data-v-1c2bdd13="" class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">推荐买手</span>
              </div> 
              <select v-model="parameter.purchaser_id">
                <option v-for="buyer in buyerList" :value="buyer.id">{{buyer.name}}</option>
              </select>
          </div>
        </a>
        <!--送礼-->
        <a data-v-1c2bdd13="" class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">送礼</span>
              </div>
              <input type="checkbox" v-model="parameter.is_gift"/>
          </div>
        </a>
        <mt-button size="large" type="primary" @click="addOrders()">提交</mt-button>
      </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'addOrders',
  data () {
    return {
      parameter: {
        user_name: '',
        user_phone: '',
        consignee: '',
        consignee_phone: '',
        consignee_address: '',
        goods_id: '',
        goods_num: 1,
        deal_price: '',
        remark: '', // 备注
        is_gift: false,
        purchaser_id: '' // 选择的买手
      },
      disabled: false,
      buyerList: [] // 品牌列表
    }
  },
  methods: {
    getBuyerList () {
      this.$http.get('/v1/manage/buyers').then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.buyer_list.length > 0) {
          this.parameter.purchaser_id = res.buyer_list[0].id
          this.buyerList.push(...res.buyer_list)
        }
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 提交订单
    addOrders () {
      const data = this.parameter
      if (data.user_name === '') {
        this.$toast('请填写购买人姓名')
      } else if (data.consignee === '' || data.consignee_phone === '' || data.consignee_address === '') {
        this.$toast('请填写完整的收货人信息')
      } else if (data.goods_id === '' || data.goods_num === '' || data.deal_price === '') {
        this.$toast('请填写完整的商品信息')
      }else {
        this.parameter.is_gift = this.parameter.is_gift ? 1 : 0
        this.$http.post('/v1/manage/order', this.parameter).then(function (res) {
          // MessageBox.alert('操作成功').then(action => {
          //   this.$router.push({name: 'CServer'})
          // })
          // 告诉另一个服务器 创建了一个订单
          this.$http.get('http://doorsasia.com:7001/order').then(function (res) {
            MessageBox.alert('操作成功').then(action => {
              this.$router.push({name: 'CServer'})
            })
          }, function (res) {
            this.$toast(JSON.parse(res.bodyText))
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      }
    }
  },
  created () {
    this.parameter.token = this.$cookies.get('session')

    let href = location.href
    if (href.indexOf('?') !== -1) {
      this.parameter.goods_id = href.split('=')[1]
      this.disabled = true
    }
    // 初始化成功之后先请求买手列表
    this.getBuyerList()
  }
}
</script>

<style scoped>
.addOrders
{
  position:relative;
  width:100%;
  height:100%;
}
.main-wrapper{
  text-align: left
}
h3{
  text-align: left;
  padding: 10px;
}
</style>
