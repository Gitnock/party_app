<template>
  <div class="user-tab">
    <div class="friend-avatar">
      <vs-avatar
        size="38"
        color="#202330"
        circle
        badge-color="primary"
        badge-position="bottom-right"
        class="clickable btn-drop"
        @click="friendScreen = !friendScreen"
        :badge="getFriendRequests.length>0"
      >
        <div class="friend-img">
          <img src="@/assets/friend.svg" alt="friend icon" />
        </div>
      </vs-avatar>
    </div>
    <div class="user-avatar">
      <vs-tooltip
        bottom
        shadow
        interactivit
        not-hover
        v-model="activeProfile"
        class="username-text"
      >
        <vs-avatar
          size="38"
          color="#2B2E43"
          circle
          badge-color="success"
          badge-position="bottom-left"
          class="clickable btn-drop"
          @click="activeProfile = !activeProfile"
        >
          <img
            v-bind:src="`${getProfile.avatar}`"
            v-if="getProfile.avatar"
            alt="profile image"
            draggable="false"
          />
          <template v-if="!getProfile.avatar && getProfile.username" #text>
            {{ getProfile.username.charAt(0) }}
          </template>
        </vs-avatar>

        <template #tooltip>
          <div class="content-tooltip">
            <div class="prof-top">
              <div class="prof-tob-content">
                <div class="avatar-container">
                  <vs-avatar size="60" color="#2B2E43" circle>
                    <img
                      v-bind:src="`${getProfile.avatar}`"
                      v-if="getProfile.avatar"
                      alt="profile image"
                      draggable="false"
                    />
                    <template
                      v-if="!getProfile.avatar && getProfile.username"
                      #text
                    >
                      {{ getProfile.username.charAt(0) }}
                    </template>
                  </vs-avatar>
                </div>

                <h5 class="username-text">
                  {{ getProfile.username + '#' + getProfile.tag }}
                </h5>
                <vs-button main flat @click="openSettings">
                  Manage your account
                </vs-button>
              </div>
            </div>
            <div class="prof-mid"></div>
            <div class="prof-bot"></div>

            <footer style="color: #626891" class="clickable">
              <p>Privacy policy | v-0.7.1</p>
            </footer>
          </div>
        </template>
      </vs-tooltip>
    </div>

    <vs-dialog
      square
      full-screen
      not-close
      v-model="settingScreen"
      class="full-screen-dialog"
    >
      <div class="settings-view">
        <div class="setting-close-section">
          <div class="setting-close-container">
            <vs-avatar
              circle
              color="#2B2E43"
              class="btn-drop"
              @click="settingScreen = !settingScreen"
            >
              <i class="bx bx-x" style="color: #ffffff"></i>
            </vs-avatar>
          </div>
        </div>
        <settings></settings>
      </div>
    </vs-dialog>
    <vs-dialog
      square
      full-screen
      not-close
      v-model="friendScreen"
      class="full-screen-dialog"
    >
      <div class="settings-view">
        <div class="setting-close-section">
          <div class="setting-close-container">
            <vs-avatar
              circle
              color="#2B2E43"
              class="btn-drop"
              @click="friendScreen = !friendScreen"
            >
              <i class="bx bx-x" style="color: #ffffff"></i>
            </vs-avatar>
          </div>
        </div>
        <friends></friends>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import settings from '@/components/settings/settings.vue';
import friends from '@/components/friends/friends.vue';
import eventBus from '@/eventBus';

export default {
  name: 'user_tab',
  data: () => ({
    activeProfile: false,
    settingScreen: false,
    friendScreen: false,
    usernameChar: '',
  }),
  computed: {
    ...mapGetters(['getProfile', 'getFriendRequests']),
  },
  components: {
    settings,
    friends,
  },
  methods: {
    openSettings() {
      this.settingScreen = !this.settingScreen;
      this.activeProfile = !this.activeProfile;
    },
  },
  mounted() {
    eventBus.$on('close', () => {
      this.friendScreen = false;
    });
  },
};
</script>

<style lang="scss">
$color_one: #202125;
$color_two: #2d2e30;
$color_three: #393a3c;
$main: #7957d5;

.user-main {
  height: 100%;
  width: 100%;
}

.user-tab {
  display: flex;
}

//friend avatar
.friend-avatar {
  margin-right: 24px;
}
.friend-img {
  width: 12px;
  height: 14px;
}
div.vs-avatar__badge {
  // height: 18px !important;
  // width: 18px !important;
  border: none !important;
  // background: $c1_dark !important;
  // border: 8px solid $c3_dark !important;
}
.content-tooltip {
  width: 252px;
  padding: 12px;
}

// settings
div.vs-dialog--fullScreen {
  width: calc(100% - 0px) !important;
  height: calc(100% - 0px) !important;
  max-width: none !important;
  max-height: none !important;
  background-color: $c1_dark;
  margin: 0 !important;
}
div.vs-dialog__content {
  height: 100%;
}
.setting-close-section {
  width: 100%;
  height: 60px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 18px;
}
.settings-view {
  height: 100%;
}
/* profile popup */
div.vs-tooltip {
  background-color: $c2_dark !important;
}
.prof-top {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0;
}
.prof-top-content {
  max-width: 160px;
}
.div.vs-dialog {
  background: $c3_dark !important;
}
.avatar-container {
  display: flex;
  justify-content: center;
}
.username-text {
  color: white;
}

/* avatar main container*/
.avatar-main-cantainer {
  display: flex;
}
</style>
