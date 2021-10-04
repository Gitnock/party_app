<template>
  <div class="main">
    <div class="setting-left">
      <div
        class="setting-menu"
        v-dragscroll.x
        ref="settingsScroll"
      >
        <button
          class="setting-menu-item roboto-m clickable btn-drop"
          v-on:click="settingPosition = 0"
          v-bind:class="classObject(0)"
        >
          Friends
        </button>
        <button
          class="setting-menu-item roboto-m clickable btn-drop"
          v-on:click="settingPosition = 1"
          v-bind:class="classObject(1)"
        >
          Pending
        </button>
        <button
          class="setting-menu-item-add roboto-m clickable btn-drop"
          v-on:click="settingPosition = 2"
          v-bind:class="classObject(2)"
        >
          Add Friend
        </button>
      </div>
    </div>
    <div class="setting-right">
      <div class="left-content"  v-dragscroll>
        <friends
          class="setting-item"
          v-show="settingPosition === 0"
        ></friends>
        <friendPending
          class="setting-item"
          v-show="settingPosition === 1"
        ></friendPending>
        <friendAdd
          class="setting-item"
          v-show="settingPosition === 2"
        ></friendAdd>

      </div>
    </div>
  </div>
</template>

<script>
import friendAdd from '@/components/friends/friends-add.vue';
import friendPending from '@/components/friends/friends-pending.vue';
import friends from '@/components/friends/friends-friends.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    friends,
    friendPending,
    friendAdd,
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
        selectedBackground: this.settingPosition === num && this.settingPosition !== 2,
        selectedBackgroundAdd: this.settingPosition === num && this.settingPosition === 2,
      };
    },
    ...mapActions(['signOutAction', 'friendStatusAction']),
  },
  mounted() {
    this.friendStatusAction();
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
  width: 329px;
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
  &:hover{
    background-color: $c2_dark;
  }
}

.selected {
  color: $c5_dark;
}
.setting-menu-item-add {
  width: 100%;
  font-size: 18px;
  padding: 12px;
  border-radius: 12px;
  color: #195BFF;
  white-space: nowrap;
  border: none;
  background-color: transparent;
  text-align: left;
  &:hover{
    background-color: rgba(34, 65, 104, 0.29);
  }
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
    background-color: $c2_dark;
  }
  .selectedBackgroundAdd{
    background-color: rgba(34, 65, 104, 0.29);
  }
}
</style>
