<template>
  <div class="addGoods">
      <mt-header>
        <router-link to="/service" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="main-wrapper">
        <mt-field label="名称" placeholder="请输入产品名称" v-model="name"></mt-field>
        <mt-field label="采购价格" placeholder="请输入产品价格" v-model="price"></mt-field>
        <mt-field label="介绍" placeholder="请输入产品介绍" v-model="introduce"></mt-field>

        <!--品牌列表-->
        <a data-v-1c2bdd13="" class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">品牌</span>
              </div> 
              <select v-model="selectedBrand">
                <option v-for="brand in brandList" :value="brand.id">{{brand.name}}</option>
              </select>
          </div>
        </a>
        <!--一级分类-->
        <a class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">一级分类</span>
              </div> 
              <div class="mint-cell-value">
                <select v-model="selectedFirst" @change="firstChange">
                  <option v-for="cla in classList" :value="cla.id">{{cla.name}}</option>
                </select>
              </div>
          </div>
        </a>
        <!--二级分类-->
        <a class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">二级分类</span>
              </div> 
              <div class="mint-cell-value">
                <select v-model="selectedSecond" @change="secondChange">
                  <option v-for="cla in secondClass" :value="cla.id">{{cla.name}}</option>
                </select>
              </div>
          </div>
        </a>
        <!--三级分类-->
        <a class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">三级分类</span>
              </div> 
              <div class="mint-cell-value">
                <select v-model="selectedThird">
                  <option v-for="cla in thirdClass" :value="cla.id">{{cla.name}}</option>
                </select>
              </div>
          </div>
        </a>
        <!--图片-->
        <a class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">上传图片</span>
            </div> 
            <input type="file" @change="onFileChange" class="uploadFile" ref="file">
          </div>
        </a>
        <img :src="upload_img" v-if="upload_img !== ''" class="tickeImg">
        <mt-button size="large" type="primary" @click="addGoods()">提交</mt-button>
      </div>
  </div>
</template>

<script>
import upload from './../components/Upload.vue'
import { Indicator, MessageBox } from 'mint-ui'
export default {
  name: 'addGoods',
  components: {
    upload
  },
  data () {
    return {
      good_id: '', // 编辑的时候需要的商品ID
      name: '',
      price: '',
      file: '',
      introduce: '',
      sheetVisible: false,
      selectedBrand: '', // 选择的品牌
      selectedFirst: '', // 选择的一级分类
      selectedSecond: '', // 选择的二级分类
      selectedThird: '', // 选择的三级分类
      brandList: [], // 品牌列表
      classList: [], // 一级分类列表
      secondClass: [], // 二级分类列表
      thirdClass: [], // 三级分类列表
      upload_img: '',
      uptokenUrl: '/v1/images/uptoken/goods_image'
    }
  },
  watch: {
    // 如果一级分类列表切换
    selectedFirst (curVal, oldVal) {
      const len = this.classList.length
      for (var i = 0; i < len; i++) {
        const cur = this.classList[i]
        if (cur.id === curVal) {
          // 二级分类的列表 先清空 再赋值
          this.secondClass.length = 0
          this.secondClass.push(...cur.items)
          // 默认选中第一个
          if (this.selectedSecond === '') {
            this.selectedSecond = this.secondClass[0].id
          }
        }
      }
    },
    // 如果二级分类列表切换
    selectedSecond (curVal, oldVal) {
      const len = this.secondClass.length
      for (var i = 0; i < len; i++) {
        const cur = this.secondClass[i]
        if (cur.id === curVal) {
          // 二级分类的列表 先清空 再赋值
          this.thirdClass.length = 0
          this.thirdClass.push(...cur.items)
          // 默认选中第一个
          if (this.selectedThird === '') {
            this.selectedThird = this.thirdClass[0].id
          }
        }
      }
    }
  },
  methods: {
    onFileChange () {
      let inputDOM = this.$refs.file

      // 通过DOM取文件数据
      this.file = inputDOM.files[0]

      const self = this
      const flag = 'thumbTail'

      const formData = new FormData()
      formData.append('file', this.file)

      // 显示加载进度条
      Indicator.open({
        text: '上传中...',
        spinnerType: 'fading-circle'
      })
      this.$http.get(this.uptokenUrl).then(function (response) {
        const result = response.body

        formData.append('token', result.token)
        formData.append('key', result.key)

        // 暂存图片地址
        let img = result.domain + result.key
        this.$http.post('http://up.qiniu.com', formData, {
          progress (event) {
            // 传递给父组件的progress方法
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
            console.info('上传失败')
            self.$emit('complete', 500, result, flag)
          }
        }, error => self.$emit('complete', 500, error.message), flag)
      })
    },
    firstChange () {
      this.selectedSecond = ''
      this.selectedThird = ''
    },
    secondChange () {
      this.selectedThird = ''
    },
    // 获得品牌列表
    getBrandList () {
      this.$http.get('/v1/manage/goods/brand/list').then(function (res) {
        res = JSON.parse(res.bodyText)

        // 如果数据加载完全了
        if (res.brand_list.length > 0) {
          // 默认选中第一个品牌
          this.selectedBrand = res.brand_list[0].id
          this.brandList.push(...res.brand_list)
        }

        // 如果是编辑 则请求数据
        if (this.good_id !== '') {
          this.getGoodDetail()
        }
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 获得商品详情
    getGoodDetail () {
      this.$http.get('/v1/manage/goods/' + this.good_id).then(function (res) {
        res = JSON.parse(res.bodyText)
        // 赋值
        this.name = res.name
        this.price = res.purchase_price
        this.introduce = res.description
        this.selectedBrand = res.brand.id
        this.upload_img = res.images[0]

        // 一级和二级和三级分类赋值
        let arr = res.class.id
        let firstIndex = arr.substring(0, 1) - 1
        let secondIndex = arr.substring(1, 2) - 1
        this.selectedFirst = this.classList[firstIndex].id
        this.selectedSecond = this.classList[firstIndex].items[secondIndex].id
        this.selectedThird = res.class.id

        // 用作测试用
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    getClassList () {
      this.$http.get('/v1/manage/goods/class/list').then(function (res) {
        res = JSON.parse(res.bodyText)
        // 如果数据加载完全了
        if (res.class_list.length > 0) {
          this.selectedFirst = res.class_list[0].id
          this.classList.push(...res.class_list)
        }
        // 再请求品牌列表
        this.getBrandList()
      }, function (res) {
        this.$toast(JSON.parse(res.bodyText))
      })
    },
    // 创建商品
    addGoods: function () {
      if (this.name === '') {
        this.$toast('请填写商品名称')
      } else if (this.introduce === '') {
        this.$toast('请填写商品介绍')
      } else if (this.upload_img === '') {
        this.$toast('请上传商品图片')
      } else {
        let para = {}
        para.token = this.$cookies.get('session')
        para.class_id = this.selectedThird
        para.brand_id = this.selectedBrand
        para.goods_name = this.name
        para.description = this.introduce
        if (this.price !== '') {
          para.purchase_price = this.price
        }
        para.images = []
        para.images.push(this.upload_img)

        // 编辑
        if (this.good_id !== '') {
          this.$http.put('/v1/manage/goods/' + this.good_id, para).then(function (res) {
            MessageBox.alert('操作成功').then(action => {
              this.$router.push({name: 'CServer'})
            })
          }, function (res) {
            this.$toast(JSON.parse(res.bodyText))
          })
        } else {
          this.$http.post('/v1/manage/goods', para).then(function (res) {
            MessageBox.alert('操作成功').then(action => {
              this.$router.push({name: 'CServer'})
            })
          }, function (res) {
            this.$toast(JSON.parse(res.bodyText))
          })
        }
      }
    }
  },
  created () {
    let href = location.href
    if (href.indexOf('?') !== -1) {
      this.good_id = href.split('=')[1]
    }

    // 初始化成功之后先请求品牌列表
    this.getClassList()
  }
}
</script>

<style scoped>
.addGoods
{
  position:relative;
  width:100%;
  height:100%;
}
.brandList{
  height: 200px;
}
.uploadFile{
  padding-left:20px; 
}
.tickeImg{
  height: 100px;
}
</style>
