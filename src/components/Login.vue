<template>
  <div class="login">
      <div class="login-wrapper">
        <img src="../../static/assets/img/login.png">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="name"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" v-model="password"></mt-field>
        <mt-button type="primary" size="large" v-on:click="login">登录</mt-button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      name: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      if (this.name.trim().length === 0 || this.password.trim().length === 0) {
        this.$toast('请输入用户名和密码')
      } else {
        this.$http.post('/v1/users/login', {is_manager: 1, username: this.name, password: this.password, terminal: 0}).then(function (res) {
          res = JSON.parse(res.bodyText)
          const type = res.user.user_type

          // 账号密码登录，在客户端做路由跳转
          this.$cookies.set('session', res.token)
          this.$cookies.set('userType', type)
          switch (parseInt(type)) {
            case 2:
              this.$router.push({name: 'Index'})
              break
            case 3:
              this.$router.push({name: 'Finance'})
              break
            case 4:
              this.$router.push({name: 'Operate'})
              break
            case 5:
              this.$router.push({name: 'Buyer'})
              break
            case 6:
            case 7:
              this.$router.push({name: 'CServer'})
              break
          }
        }, function (res) {
          this.$toast(JSON.parse(res.bodyText))
        })
      }
    }
  }
}
</script>

<style scoped>
.login
{
  position:relative;
  width:100%;
  height:100%;
}
.login-wrapper
{
    box-sizing: border-box;
    padding: 0 20px;
    top: 50%;
    position: absolute;
    width: 100%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
</style>
