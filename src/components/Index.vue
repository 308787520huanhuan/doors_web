<template>
  <div class="index">
      <mt-header title="面板页">
        <router-link to="/login" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="index-wrapper">
        <router-link to="/service" slot="left">
          <mt-button type="default" size="large" class="list">客服端</mt-button>
        </router-link>
        <router-link to="/buyer" slot="left">
          <mt-button type="default" size="large" class="list">买手端</mt-button>
        </router-link>
        <router-link to="/operate" slot="left">
          <mt-button type="default" size="large" class="list">运营端</mt-button>
        </router-link>
        <router-link to="/finance" slot="left">
          <mt-button type="default" size="large" class="list">财务端</mt-button>
        </router-link>
      </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped>
.index
{
  position:relative;
  width:100%;
  height:100%;
}
.index-wrapper
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
</style>
