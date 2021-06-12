<template>
  <div class="main">
    <topNav></topNav>
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import topNav from '@/components/nav.vue';

export default {
  components: {
    topNav,
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  overflow: hidden;
}
.main-container {
    height: 100%;
}
</style>
