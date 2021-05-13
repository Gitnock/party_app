<template>
  <div class="main">
    <div class="setting-left">
      <div class="setting-menu">
        <div
          class="setting-menu-item roboto-medium clickable"
          v-on:click="settingPosition = 0"
          v-bind:class="classObject(0)"
        >
          Username & Avatar
        </div>
        <div
          class="setting-menu-item roboto-medium clickable"
          v-on:click="settingPosition = 1"
          v-bind:class="classObject(1)"
        >
          Account Information
        </div>
        <div
          class="setting-menu-item roboto-medium clickable"
          v-on:click="settingPosition = 2"
          v-bind:class="classObject(2)"
        >
          Password
        </div>
        <div class="setting-menu-item roboto-medium clickable">Help</div>
        <div
          class="setting-menu-item-logout roboto-medium clickable"
          @click="signOut"
        >
          Log Out
        </div>
      </div>
    </div>
    <div class="setting-right">
      <div class="left-content">
        <settingsName v-if="settingPosition === 0"></settingsName>
        <settingsAccount v-if="settingPosition === 1"></settingsAccount>
        <settingsPassword v-if="settingPosition === 2"></settingsPassword>
      </div>
    </div>
  </div>
</template>

<script>
import settingsName from '@/components/settings/settings-name.vue';
import settingsAccount from '@/components/settings/settings-account.vue';
import settingsPassword from '@/components/settings/settings-password.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    settingsName,
    settingsAccount,
    settingsPassword,
  },
  data() {
    return {
      settingPosition: 0,
      isLogout: false,
      isHelp: false,
    };
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOutAction');
      this.signOutAction().then(() => {
        this.$router.push('/signin');
      });
    },
    classObject(num) {
      return {
        selected: this.settingPosition === num,
      };
    },
    ...mapActions(['signOutAction']),
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  height: 100%;
}
//setting left
.setting-left {
  // background: red;
  width: 329px;
  max-width: 329px;
  padding-left: 16px;
  margin-right: 16px;
  padding: 16px;
}
.setting-menu {
  // display: flex;
  // justify-content: center;
}
.setting-menu-item {
  width: 100%;
  font-size: 18px;
  padding: 12px;
  border-radius: 12px;
  color: #626891;
}

.selected {
  color: #b7bbd5;
}
.setting-menu-item-logout {
  width: 100%;
  font-size: 18px;
  padding: 12px;
  border-radius: 12px;
  color: #ff4757;
}

.setting-menu-item:hover {
  background-color: #2f3247;
}
.setting-menu-item-logout:hover {
  background-color: rgba(255, 71, 87, 0.15);
}

//setting right
.setting-right {
  // width: 630px;
  height: 86vh;
  padding-right: 32px;
  overflow-y: auto;
}
.left-content {
  width: 630px;

  // background-color: rosybrown;
}

@media only screen and (max-width: 1029px) {
  .setting-menu-item {
    font-size: 16px;
  }
  .left-content {
    width: 480px;
  }
}
</style>
