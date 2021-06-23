<template>
  <div class="main" @contextmenu.prevent>
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
  display: flex;
  flex-direction: column;
}
.main-container {
    flex: 1;
}
</style>
