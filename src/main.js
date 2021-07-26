import 'vuesax/dist/vuesax.css';
import 'buefy/dist/buefy.css';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Vue from 'vue';
// vuesax
import Vuesax from 'vuesax';
import {
  Select, Field, Slider, Image,
} from 'buefy';

import VueCropper from 'vue-cropper';
import VueDragscroll from 'vue-dragscroll';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

const fb = require('./firebaseConfig');

Vue.config.productionTip = false; // Vuesax styles
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.use(VueCropper);
Vue.use(Vuesax);
Vue.use(Select);
Vue.use(Field);
Vue.use(Slider);
Vue.use(Image);
Vue.use(VueDragscroll);
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
