/*
 * @Author: airmz
 * @Date: 2021-12-28 18:09:48
 * @LastEditTime: 2021-12-30 11:57:52
 * @FilePath: /pd/src/main.js
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import Vue from 'vue'
import Vuex from 'vuex'

// import login from './views/pageDesign/login'
import router from './router'
// import './ElementUI'
import store from './store/index'
import { sync } from 'vuex-router-sync'
import validator from 'UTIL/validator'
import 'UTIL/filters'
import toast from 'COMMON/toast/toast.js'
import local from 'API/local.js'
// import 'COMMON/index'

import qs from 'qs'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import qiniu from 'UTIL/qiniu'
import infiniteScroll from 'vue-infinite-scroll'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$local = local

Vue.prototype.$domain = 'http://draw.dd0531.com'

// Vue.prototype.$domain = 'http://192.168.1.4:8081/'
// Vue.prototype.$domain = 'http://draws.dd0531.com'
Vue.prototype.$clientId = 'C_' + Math.round(Math.random() * 999999999)

// Vue.prototype.$domain = 'http://localhost:8081'

if (process.env.NODE_ENV === 'development') {
  require('./ElementUI')
}

Vue.config.productionTip = false
Vue.prototype.$imgDomain = 'https://pic.dd0531.com/'

Vue.use(Vuex)
Vue.use(validator)
Vue.use(qiniu)
Vue.use(toast)
Vue.use(local)
Vue.use(VueLazyload)
Vue.use(infiniteScroll)
// Vue.use(ElementUI)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
