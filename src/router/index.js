import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import VueRouter from 'vue-router';

import Signin from '@/views/Signin.vue';
import Signup from '@/views/Signup.vue';
import PartyCall from '@/views/PartyCall.vue';
import friendCall from '@/views/friendCall.vue';
import Index from '@/views/Index.vue';
import Alpha from '@/views/Alpha.vue';
import Main from '@/views/Main.vue';
import Test from '@/views/Party2.vue';
// import NotFound from '@/views/404.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  // { path: '/404', component: NotFound },
  // { path: '*', redirect: '/404' },
  {
    path: '/crew',
    name: 'main',
    meta: { requiresAuth: true },
    component: Main,
    children: [
      {
        path: '@me',
        name: 'me',
        component: Home,
      },
      {
        path: '/crew/:roomId',
        name: 'party',
        component: PartyCall,
      },
      {
        path: '/test',
        name: 'test',
        component: Test,
      },
      {
        path: '@me/:roomId',
        name: 'friendCall',
        component: friendCall,
      },
    ],

  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/alpha',
    name: 'alpha',
    component: Alpha,
    meta: { requiresAuth: true },
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  // console.log('isauthenticated', isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next('/signin');
  } else {
    next();
  }
});

export default router;
