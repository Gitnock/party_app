import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import VueRouter from 'vue-router';

import Signin from '@/views/Signin.vue';
import Signup from '@/views/Signup.vue';
import Party from '@/views/Party.vue';
// import Crew from '@/views/Crew.vue';
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
        path: '/crew/:id',
        name: 'party',
        component: Party,
      },
    ],

  },
  {
    path: '/app',
    name: 'home',
    meta: { requiresAuth: true },
    component: Home,
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
  // {
  //   path: '/crew',
  //   name: 'crew',
  //   component: Crew,
  //   children: [
  //     {
  //       path: '/crew/:roomId',
  //       name: 'party',
  //       component: Party,
  //     },
  //   ],
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  console.log('isauthenticated', isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next('/signin');
  } else {
    next();
  }
});

export default router;
