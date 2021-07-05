import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import VueRouter from 'vue-router';

import Signin from '@/views/Signin.vue';
import Signup from '@/views/Signup.vue';
import Party from '@/views/Party.vue';
import Index from '@/views/Index.vue';
import Alpha from '@/views/Alpha.vue';
import Main from '@/views/Main.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
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
        component: Party,
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
