<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',

  created () {
    // 检查token和userType是否完整
    let token = this.$cookies.get('session')
    let userType = this.$cookies.get('userType')
    if (token == null || userType == null) {
      this.$cookies.remove('session')
      this.$cookies.remove('userType')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}
</style>
