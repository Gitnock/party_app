<template>
  <div>
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
              <p>Privacy policy | v-0.6.8</p>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import settings from '@/components/settings/settings.vue';

export default {
  name: 'user_tab',
  data: () => ({
    activeProfile: false,
    settingScreen: false,
    usernameChar: '',
  }),
  computed: {
    ...mapGetters(['getProfile']),
  },
  components: {
    settings,
  },
  methods: {
    openSettings() {
      this.settingScreen = !this.settingScreen;
      this.activeProfile = !this.activeProfile;
    },
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

div.vs-avatar__badge {
  height: 18px !important;
  width: 18px !important;
  // border: none !important;
  border: 2px solid #2f3247 !important;
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
  background: #161823 !important;
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
  background-color: #202330 !important;
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
.vs-dialog {
  background: #2f3247 !important;
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
