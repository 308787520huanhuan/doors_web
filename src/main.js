// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import MintUI from 'mint-ui'
import VueCookies from 'vue-cookies'

import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.use(MintUI)
Vue.use(VueResource)
Vue.use(VueCookies)

Vue.http.interceptors.push((request, next) => {
  // ...
  // 请求发送前的处理逻辑
  // ...
  if (request.url.indexOf('http://up.qiniu.com') !== 0) {
    let token = Vue.cookies.get('session')
    if (token) {
      request.params['token'] = token
    }
  }

  next((response) => {
  // ...
  // 请求发送后的处理逻辑
  // ...
  // 根据请求的状态，response参数会返回给successCallback或errorCallback
    let data
    var contentType = response.headers.get('Content-Type')
    if (typeof contentType === 'string' && contentType.indexOf('application/json') === 0) {
      data = response.body
    } else {
      data = JSON.parse(response.body)
    }
    console.info(data)
    if (data) {
      if (data['error_code'] === 406) {
        // 没有权限
        Vue.cookies.remove('session')
        Vue.cookies.remove('userType')
        Vue.router.push({name: 'noAccessRight'})
      }
    }

    if (response.status === 500) {
      if (response.data.message === 'Token has expired, but is still valid.') {
        console.log('RETRY', response)
      } else {
        alert('Whoops, an unknown error occured.')
      }
    }
  })
})

router.beforeEach((to, from, next) => {
  // 模拟登陆状态
  let token = Vue.cookies.get('session')
  let userType = Vue.cookies.get('userType')
  console.info('-------------beforeEach--------------')
  console.info('to.path:' + to.path)
  console.info('token:' + token)
  console.info('userType:' + userType)
  //是否已经登录
  if (token && userType) {
    console.info('有token有用户类型')
    // 有token有用户类型，则自动导航到相应页面
    if (to.path === '/' || to.path === '/home') {
      switch (parseInt(userType)) {
        case 2:
          next({path: '/index'})
          break
        case 3:
          next({path: '/finance'})
          break
        case 4:
          next({path: '/operate'})
          break
        case 5:
          next({path: '/buyer'})
          break
        case 6:
        case 7:
          next({path: '/service'})
          break
        default:
          next({path: '/noAccessRight'})
          break
      }
      return
    }
  } else if (to.path !== '/login') { //没有登录
    console.info('导航到登录')
    let ua = window.navigator.userAgent.toLowerCase()
    // 如果是微信客服端
    if ( ua.indexOf('micromessenger') > 1) {
      var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaec9722f7a9a7d5b&redirect_uri=http%3a%2f%2fdoorsasia.com%3a8001%2fv1%2fwechat%2fenterprise%2fauthorization&response_type=code&scope=snsapi_userinfo&agentid=2&state=epjdnfdfdsaf000#wechat_redirect'
      window.location.href = url
    } else { //PC 端
      next({path: '/login'})
    }
    return
  } 
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})