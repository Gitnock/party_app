import Vue from 'vue';

import Vuesax from 'vuesax';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'vuesax/dist/vuesax.css';

Vue.config.productionTip = false;// Vuesax styles

Vue.use(Vuesax, {
  // options here
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
