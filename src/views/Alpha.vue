<template>
  <div class="main">
    <div class="main-content">
      <div class="alpha-container">
        <div class="container has-text-centered">
          <img src="../assets/alpha_window.svg" alt="" />
          <h1 class="title roboto-black partyapp-title" style="color: black">
            On the wait list
          </h1>
          <h2 class="partyapp-subtitle subtitle roboto-regular">
            Your on the wait list, you will be emailed when the alpha period begins.
          </h2>
          <div class="has-text-centered button-container">
            <vs-button @click="signOut" border size="large"> Logout </vs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      flag: 0,
    };
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: 'Signin' });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  background-color: white;

}
.main-content {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}
.alpha-container {
  max-width: 330px;
}
.button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
