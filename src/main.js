import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'

// 环境切换配置
import {
  routerMode
} from './config/env'
// px转换rem
import './config/rem'
/**
 * 移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才会触发点击事件， 
 * 这是为了检查用户是否在做双击。 为了能够立即响应用户的点击事件， 
 * 才有了FastClick;
 */
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

Vue.use(VueRouter)


// 阻止启动生产消息， 常用作指令。
Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
    // to：要进入的目标路由对象，到哪里去
    // from：离开的路由对象，哪里来
    // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  }
})

/**
 * 这边做一下标记，可以百度这个函数，我觉得这个东西非常好用
 * 
 * 在文档页面(http: //localhost:8080/document)拉动滚动条，
 * 然后刷新浏览器会发现滚动条依然在原来的位置，这是浏览器的默认行为，
 * 会记录浏览器滚动条默认位置。

但是点击浏览器“ 前进 / 后退” 按钮， 会发现当初那个页面的滚动条从0开始了， 
没有记录上一次滚动条的位置。 现在要求点击浏览器“ 前进 / 后退” 按钮， 
页面滚动条要记录上一次的位置， 这时需要设置它的的滚动行为。

     这时候需要在路由配置中设置 scrollBehavior(to, from, savePosition) 函数， 
     函数有三个参数。 scrollBehavior() 函数在点击浏览器的“ 前进 / 后退”， 
     或者切换导航的时候触发。
 */


new Vue({
  router,
  store,
}).$mount('#app')
