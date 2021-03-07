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
      }
    });
  },
};
</script>

<style lang="scss" >
@import './assets/styles/init.scss';

#app {
  background: $color_one;
}
</style>
