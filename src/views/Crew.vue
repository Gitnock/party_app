<template>
  <div class="main">
      <topNav></topNav>
      <div class="main-content">
        <router-view />
      </div>

  </div>
</template>

<script>
import topNav from '../components/nav.vue';

export default {
  components: {
    topNav,
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #2b2e43;
  padding-top: 40px;
}
.main-content{
  overflow: hidden;
}
</style>
