<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('setUser', user);
        this.$store.dispatch('bindUserProfileRef');
        this.$store.dispatch('bindGameRef');
      }
    });
  },
};
</script>

<style lang="scss" >
@import './assets/styles/init.scss';
</style>
