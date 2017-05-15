<template>
  <div class="orderDetail">
      <mt-header>
        <router-link to="/buyer" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <div class="topCpntent">
          <span>订单号：{{parameter.sn}}</span>
          <span class="fr" v-if="parameter.order_status == 1" @click="cancel()">取消订单</span>
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
        <div class="status3" v-if="order_status == 3">
          <mt-field label="快递公司" placeholder="请输入快递公司名称" v-model="express"></mt-field>
          <mt-field label="快递单号" placeholder="请输入快递单号" v-model="number"></mt-field>
          <!--运营者地址列表-->
          <a class="mint-cell mint-field">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <span class="mint-cell-text">运营者</span>
                </div> 
                <select v-model="selectedConsignee">
                  <option v-for="con in consignees" :value="con">{{con.consignee}}</option>
                </select>
            </div>
          </a>
          <!--图片-->
          <a class="mint-cell mint-field">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <span class="mint-cell-text">发票</span>
                </div> 
                <input type="file" @change="onFileChange" class="uploadFile" ref="file">
            </div>
          </a>
          <img :src="upload_img" v-if="upload_img !== ''" class="tickeImg">
        </div>
        <mt-button type="primary" size="large" v-on:click="receive()" v-if="order_status == 1" class="operBtn">确定接单</mt-button>
        <mt-button type="primary" size="large" v-on:click="confirmBuy()" v-if="order_status == 2" class="operBtn">采购完成</mt-button>
        <mt-button type="primary" size="large" v-on:click="sendGoods()" v-if="order_status == 3" class="operBtn">发货</mt-button>
      </div>
  </div>
</template>

<script>
import { MessageBox, Indicator } from 'mint-ui'
export default {
  name: 'orderDetail',
  data () {
    return {
      order_id: '',
      express: '', // 快递公司
      number: '', // 快递单号
      order_status: '',
      upload_img: '',
      parameter: '',
      consignees: [], // 运营者地址列表
      selectedConsignee: '' // 选择的运营者
    }
  },
  methods: {
    // 请求订单详情
    getDetail: function () {
      this.$http.get('/v1/purchasers/order/' + this.order_id).then(function (res) {
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
        this.consignees = res.list
        this.selectedConsignee = this.consignees[0]
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 接单
    receive: function () {
      MessageBox.confirm('确定接受该订单?').then(action => {
        this.$http.put('/v1/purchasers/order/' + this.order_id + '/accept').then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Buyer'})
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
      } else if (this.upload_img === '') {
        this.$toast('请上传发票')
      } else {
        let para = {}
        para.token = this.$cookies.get('session')
        para.qa_id = this.selectedConsignee.user_id
        para.express_company = this.express
        para.tracking_number = this.number
        para.images = []
        para.images.push(this.upload_img)
        this.$http.put('/v1/purchasers/order/' + this.order_id + '/deliver', para).then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Buyer'})
          })
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      }
    },
    // 上传文件
    onFileChange () {
      let inputDOM = this.$refs.file

      // 通过DOM取文件数据
      this.file = inputDOM.files[0]
      console.info(this.file)

      const self = this
      const flag = 'thumbTail'

      const formData = new FormData()
      formData.append('file', this.file)

      // 显示加载进度条
      Indicator.open({
        text: '上传中...',
        spinnerType: 'fading-circle'
      })

      this.$http.get('/v1/images/uptoken/goods_image').then(function (response) {
        const result = response.body
        formData.append('token', result.token)
        formData.append('key', result.key)

        // 暂存图片地址
        let img = result.domain + result.key

        this.$http.post('http://up.qiniu.com', formData, {
          progress (event) {
            // 传递给父组件的progress方法
            console.info('上传进度:' + parseFloat(event.loaded / event.total * 100))
            self.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
          }
        }).then(response => {
          const result = response.body
          if (result.hash && result.key) {
            // 上传成功 显示图片
            this.upload_img = img

            // 关闭进度条
            Indicator.close()
          } else {
            self.$emit('complete', 500, result, flag)
          }
        }, error => self.$emit('complete', 500, error.message), flag)
      })
    },
    // 采购完成
    confirmBuy: function () {
      MessageBox.confirm('确定已经完成采购?').then(action => {
        this.$http.put('/v1/purchasers/order/' + this.order_id + '/purchased').then(function (res) {
          MessageBox.alert('操作成功').then(action => {
            this.$router.push({name: 'Buyer'})
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
      let tlp = href.split('&')
      this.order_id = tlp[0].split('=')[1]
      this.order_status = tlp[1].split('=')[1]

      // 如果是状态3 才请求地址列表
      this.getConsignees()
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
.operBtn{
  position: fixed;
  bottom: 0;
  border-radius: 0;
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
