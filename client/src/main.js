import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'
import VueAlertify from 'vue-alertify';
import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)
 
Vue.use(VueAlertify);
Vue.prototype.moment = moment

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
