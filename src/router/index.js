import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import VueRouter from 'vue-router';

import Signin from '@/views/Signin.vue';
import Signup from '@/views/Signup.vue';
import Party from '@/views/Party.vue';
import Crew from '@/views/Crew.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
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
    path: '/crew',
    name: 'crew',
    component: Crew,
    children: [
      {
        path: '/crew/:id',
        name: 'party',
        component: Party,
      },
    ],
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
  console.log('isauthenticated', isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next('/signin');
  } else {
    next();
  }
});

export default router;
