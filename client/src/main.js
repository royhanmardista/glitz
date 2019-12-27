import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'
import VueAlertify from 'vue-alertify'
import GSignInButton from 'vue-google-signin-button'
import { VueSpinners } from '@saeris/vue-spinners'
import Vue2Editor from 'vue2-editor'
import Transitions from 'vue2-transitions'
Vue.use(Transitions)

Vue.use(Vue2Editor)
Vue.use(VueSpinners)
Vue.use(GSignInButton)

Vue.use(VueAlertify, {
  notifier: {
    delay: 4,
    position: 'bottom-left',
    closeButton: false
  }
})
Vue.prototype.moment = moment

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
