<template>
  <div class="main">
    <div class="setting-left">
      <div
        class="setting-menu"
        v-dragscroll.x
        ref="settingsScroll"
      >
        <button
          class="setting-menu-item roboto-medium clickable btn-drop"
          v-on:click="settingPosition = 0"
          v-bind:class="classObject(0)"
        >
          Username & Avatar
        </button>
        <button
          class="setting-menu-item roboto-medium clickable btn-drop"
          v-on:click="settingPosition = 1"
          v-bind:class="classObject(1)"
        >
          Games
        </button>
        <button
          class="setting-menu-item roboto-medium clickable btn-drop"
          v-on:click="settingPosition = 2"
          v-bind:class="classObject(2)"
        >
          Account Information
        </button>
        <button
          class="setting-menu-item roboto-medium clickable btn-drop"
          v-on:click="settingPosition = 3"
          v-bind:class="classObject(3)"
        >
          Password
        </button>
        <button class="setting-menu-item roboto-medium clickable">Help</button>
        <button
          class="setting-menu-item-logout roboto-medium clickable btn-drop"
          @click="signOut"
        >
          Log Out
        </button>
      </div>
    </div>
    <div class="setting-right">
      <div class="left-content"  v-dragscroll>
        <settingsName
          class="setting-item"
          v-show="settingPosition === 0"
        ></settingsName>
        <settingsGame
          class="setting-item"
          v-show="settingPosition === 1"
        ></settingsGame>
        <settingsAccount
          class="setting-item"
          v-show="settingPosition === 2"
        ></settingsAccount>
        <settingsPassword
          class="setting-item"
          v-show="settingPosition === 3"
        ></settingsPassword>

      </div>
    </div>
  </div>
</template>

<script>
import settingsName from '@/components/settings/settings-name.vue';
import settingsAccount from '@/components/settings/settings-account.vue';
import settingsPassword from '@/components/settings/settings-password.vue';
import settingsGame from '@/components/settings/settings-games.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    settingsName,
    settingsAccount,
    settingsPassword,
    settingsGame,
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
      localStorage.removeItem('gameList');
    },
    classObject(num) {
      return {
        selected: this.settingPosition === num,
        selectedBackground: this.settingPosition === num,
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
  width: 100%;
}
//setting left
.setting-left {
  // background: red;
  width: 329px;
  // max-width: 329px;
  padding-left: 16px;
  margin-right: 16px;
  padding: 16px;
}
.setting-menu {
  display: flex;
  flex-direction: column;
}
.setting-menu-item {
  width: 100%;
  font-size: 18px;
  padding: 12px;
  border-radius: 12px;
  color: #626891;
  white-space: nowrap;
  border: none;
  background-color: transparent;
  text-align: left;
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
  white-space: nowrap;
  border: none;
  background-color: transparent;
  text-align: left;
}

.setting-menu-item:hover {
  background-color: #202330;
}
.setting-menu-item-logout:hover {
  background-color: rgba(255, 71, 87, 0.15);
}

//setting right
.setting-right {
  // width: 630px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // padding-right: 32px;
}
.left-content {
  height: 90%;
  max-width: 630px;
  flex: 1;
  //hide scroll
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  // background-color: rosybrown;
}
.left-content::-webkit-scrollbar {
  width: 0;
  height: 0;
}

//animation
.setting-item {
  animation: fadeIn 0.5s;
}

@media only screen and (max-width: 628px) {
  .main {
    flex-direction: column;
  }
  .setting-menu {
    flex-direction: row;
    //hide scroll
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    margin-bottom: 32px;
  }
  .setting-menu::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .setting-menu::-webkit-scrollbar {
    width: 2px;
  }
  .setting-left {
    width: 100%;
    overflow: hidden;
    padding-left: 0;
    margin-right: 0;
    padding: 0;
  }
  .setting-menu-item {
    width: auto;
    // height: auto;
  }
  .selectedBackground {
    background-color: #202330;
  }
}
</style>
