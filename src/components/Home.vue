<template>
  <div class="home">
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted () {
  //   let token = this.$cookies.get('session')
  //   let userType = this.$cookies.get('userType')

  //   this.$http.post('/v1/wechat/enterprise/log', {token, userType})
  //   if (this.$cookies.get('session')) {
  //     switch (parseInt(userType)) {
  //       case 2:
  //         this.$router.push({name: 'Index'})
  //         break
  //       case 3:
  //         this.$router.push({name: 'Finance'})
  //         break
  //       case 4:
  //         this.$router.push({name: 'Operate'})
  //         break
  //       case 5:
  //         this.$router.push({name: 'Buyer'})
  //         break
  //       case 6:
  //       case 7:
  //         this.$router.push({name: 'CServer'})
  //         break
  //     }
  //   } else {
  //     // this.$http.post('/v1/wechat/enterprise/log', {'from': '[Home.vue] mounted 2', 'user-type': userType})
  //     // this.$router.push({name: 'Login'})
  //     let ua = window.navigator.userAgent.toLowerCase()
  //     // 如果是微信客服端
  //     if (ua.indexOf('micromessenger') > 1) {
  //       var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaec9722f7a9a7d5b&redirect_uri=http%3a%2f%2fdoorsasia.com%3a8001%2fv1%2fwechat%2fenterprise%2fauthorization&response_type=code&scope=snsapi_userinfo&agentid=2&state=epjdnfdfdsaf000#wechat_redirect'
  //       window.location.href = url
  //     } else { // PC 端
  //       this.$router.push({name: 'Login'})
  //     }
  //   }
  }
}
</script>
