<template>
  <div class="section-nav">
      <div class="container-nav">
        <nav class="nav-left">
          <img
              src="@/assets/partyapp_logo.svg"
              alt="partyapp logo"
              class="logo-attio"
              @click="goHome"
          />
        </nav>
        <nav class="nav-right">
          <user-tab/>
        </nav>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import userTab from './user-tab.vue';

export default {
  name: 'top_nav',
  data: () => ({
    curGame: {},
    activeProfile: false,
    settingScreen: false,
  }),
  methods: {
    openLogin() {
      this.$router.push('/signin');
    },
    logout() {
      this.signOutAction();
    },
    goHome() {
      const path = '/crew/@me';
      if (this.$route.path !== path) this.$router.push(path);
    },
  },
  components: {
    userTab,
  },
  computed: {
    ...mapGetters(['isUserAuth', 'getGames']),
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/init.scss';
.partyapp-logo-container {
  padding: 8px 43px;
  display: flex;
  justify-content: center;
}
.userTab {
  padding-right: 43px;
}

// NAV
.section-nav {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-nav {
  // background-color: brown;
  max-width: 1762px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
}
.nav-right {
  display: flex;
  align-items: center;
}
.signin-btn {
  color: #b7bbd5;
  margin-right: 32px;
  &:hover {
    color: white;
  }
}
</style>
