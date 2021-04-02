<template>
  <vs-navbar color="#2F3247" text-white square center-collapsed>
          <template #left>
            <div class="partyapp-logo-container">
              <img
                src="@/assets/partyapp_logo.svg"
                alt=""
                class="partyapp-logo"
                @click="goHome"
              />
            </div>
          </template>
          <template #right>
            <div class="userTab">
              <userTab v-if="isUserAuth"/>
              <button v-else @click="openLogin">Log in </button>
            </div>
          </template>
        </vs-navbar>

</template>

<script>
import { mapGetters } from 'vuex';
import userTab from './user-tab.vue';

export default {
  name: 'top_nav',
  data: () => ({
    game: 'Valorant',
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
      this.$router.push('/');
    },
  },
  components: {
    userTab,
  },
  computed: {
    ...mapGetters(['isUserAuth']),
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
.partyapp-logo {
  height: 38px;
}
.userTab {
  padding-right: 43px;
}
</style>
