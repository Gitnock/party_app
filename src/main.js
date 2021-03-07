import 'vuesax/dist/vuesax.css';
import 'buefy/dist/buefy.css';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Vue from 'vue';
// vuesax
import Vuesax from 'vuesax';
import Buefy from 'buefy';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

const fb = require('./firebaseConfig.js');

Vue.config.productionTip = false; // Vuesax styles
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.use(Vuesax);
Vue.use(Buefy);

let app;

fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
