<template>
  <div class="publish">
    <!-- item -->
    标题
    <div style="width:100%;height:1px;background:#BBBBBB;line-height:1px;">
    </div>
    <!-- item -->
    <input style="width:100%;background:#FFFFFF;" type="text" v-model="goodsTitle"></input>
    <div style="width:100%;height:1px;background:#BBBBBB;line-height:1px;">
    </div>
    </br>
    <!-- itemEnd -->
    产品介绍
    <!-- item -->
    <div style="width:100%;height:85px;background:#FFFFFF;">
      <textarea style="width:100%;height:85px;background:#FFFFFF;"></textarea>
    </div>
    <!-- itemEnd -->
    <!--添加图片 -->
    <upload title="图片上传" :picOption="picOption" :getFiles="getFiles" :overMax="overMax" :max="6" :files="files" :uptokenUrl="uptokenUrl" uploadingText="上传中..." domain="https://img.holdno.com" >
      <!--<div slot="upload">
        <div :id="pickfiles" class="btn">点击添加门店logo/照片<img :src="uploadimgs" class="uploadimg"></div>
      </div>-->
    </upload>
    <div style="width:100%;height:50px;background:#FFFFFF;margin-top:12px;">
      <!--<div style="width:25%;height:50px;float:left;text-align:center;line-height:50px;">
        <a href="javascript:;"
           class="file"><span  id="img1_title">选文件1</span>
          <input type="file" name="" onChange="fileChange();" id="JS_choice_img">
           </a>
      </div>
      <div onclick="openCarema();"
           style="width:25%;height:50px;float:left;text-align:center;line-height:50px;">
        <a href="javascript:;"
           class="file">选文件2
          <input type="file" name="" id="JS_choice_img3">
           </a>
      </div>
      <div style="width:25%;height:50px;float:left;text-align:center;line-height:50px;">
        <a href="javascript:;"
           class="file">选文件3
          <input type="file" name="" id="JS_choice_img3">
           </a>
      </div>
      <div style="width:25%;height:50px;float:left;text-align:center;line-height:50px;">
        <a href="javascript:;"
           class="file">选文件4
          <input type="file" name="" id="JS_choice_img4">
       </a>
      </div>-->
    </div>

    <table id="category_table"
           style="width:100%;height:50px;">
      <tr>
        品牌
        <div style="width:100%;height:50px;">
          <select id="brand"
                  v-model="selectBrand"
                  style="width:100%;height:50px;">
            <option v-for="brand in brandList"
                    v-bind:value="brand.id">{{brand.name}}</option>
          </select>
        </div>
      </tr>
      <tr>
        目类
        <div style="width:100%;height:50px;">
          <select id="category"
                  v-model="selectCategory1"
                  style="width:100%;height:50px;">
            <option v-for="item in category1"
                    v-bind:value="item.id">{{item.name}}</option>
          </select>
        </div>
      </tr>
  
      <tr>
        分类
        <div style="width:100%;height:50px;">
          <select id="category2"
                  v-model="selectCategory2"
                  style="width:100%;height:50px;">
            <option v-for="item in category2"
                    v-bind:value="item.id">{{item.name}}</option>
          </select>
        </div>
      </tr>
  
      <tr>
        属性
        <div style="width:100%;height:50px;">
          <select id="category3"
                  v-model="selectCategory3"
                  style="width:100%;height:50px;">
            <option v-for="item in category3"
                    v-bind:value="item.id">{{item.name}}</option>
          </select>
        </div>
      </tr>
    </table>
  
    <!--<div style="height:1px;width:100%;background:#BBBBBB" />
      <div onclick="createGoods();" class="shit" style="width:100%;height:45px;line-height:45px;">
        <div style="text-align:center;">确认发布</div>
      </div>
      -->
  </div>
</template>

<script>
import upload from './../components/Upload.vue'
export default {
  name: 'publish',
  components: {
    upload
  },
  data () {
    return {
      msg: '发布产品',
      goodsTitle: '',
      brandList: [
        { id: 1, name: 'gucci' },
        { id: 2, name: 'lv' }],
      categoryList: [],
      category1: [],
      category2: [],
      category3: null,
      selectBrand: 1,
      selectCategory1: 1,
      selectCategory2: 1,
      selectCategory3: 1,
      files: [],
      uptokenUrl: '/v1/images/uptoken/goods_image'
    }
  },

  beforeCreate () {
    console.log('PublishGoods 生命周期:beforeCreate')

    // 品牌列表
    this.$http.get('/v1/manage/goods/brand/list').then(response => {
      this.brandList = response.data
    }, response => {
      console.log('获取品牌列表失败')
      this.brandList = [
        { id: 1, name: 'gucci' },
        { id: 2, name: 'lv' }]
    })
    // 商品目类列表
    this.$http.get('/v1/manage/goods/class/list').then(response => {
      this.categoryList = response.data
    }, response => {
      console.log('获取商品目类列表失败')
      this.categoryList = [
        { id: 1, name: '男士', items: [{id: 1, name: '西装', items: [{id: 1, name: '裤子'}]}] },
        { id: 2, name: '女士', items: [{id: 2, name: '裙子', items: [{id: 2, name: '短裙'}]}] }]
    })
  },
  methods: {
    // click pictures call back
    picOption (files, index) {
      console.log('picOption')
      console.log(files)
    },
    // get uploaded img url (files: array)
    getFiles (files) {
      console.log('getFiles')
      console.log(files)
      this.files = files
    },
    overMax () {
    }
  },
  watch: {
    categoryList: function (val) {
      console.log('watch categoryList')

      this.category1 = this.categoryList ? this.categoryList : []
      this.category2 = this.category1[0] ? this.category1[0].items : []
      this.category3 = this.category2[0] ? this.category2[0].items : []

      this.selectCategory1 = this.category1[0] ? this.category1[0].id : ''
      this.selectCategory2 = this.category2[0] ? this.category2[0].id : ''
      this.selectCategory3 = this.category3[0] ? this.category3[0].id : ''
    },
    selectCategory1: function (val) {
      console.log('watch selectCategory1')
      console.log(val)

      console.info(this.category1)
      var index = this.category1.findIndex(item => item.id === val)
      this.category2 = this.category1[index].items
      this.category3 = this.category2[0].items

      this.selectCategory2 = this.category2[0] ? this.category2[0].id : ''
      this.selectCategory3 = this.category3[0] ? this.category3[0].id : ''
    },
    selectCategory2: function (val) {
      console.log('watch selectCategory2')
      console.log(val)

      var index = this.category2.findIndex(item => item.id === val)
      this.category3 = this.category2[index].items

      this.selectCategory3 = this.category3[0] ? this.category3[0].id : ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
