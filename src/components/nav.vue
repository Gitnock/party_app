<template>
  <b-navbar class="navbar" centered>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="@/assets/partyapp_logo.svg" alt="party app logo" />
      </b-navbar-item>
    </template>
    <template #start centered="true">
      <b-navbar-item tag="div" >
        <b-select :placeholder="game" expanded class="nav-select" v-model="game">
          <option value="Valorant">Valorant</option>
          <option value="Warzone">Warzone</option>
        </b-select>
      </b-navbar-item>
    </template>

    <template #end>
       <b-navbar-item tag="div">
        <div class="buttons" @click="logout">
          <a class="button is-light"> Log out </a>
        </div>
      </b-navbar-item>
      <b-navbar-item tag="div" v-if="!isUserAuth">
        <div class="buttons" @click="openLogin">
          <a class="button is-light"> Log in </a>
        </div>
      </b-navbar-item>
      <b-navbar-item tag="div" v-else>
        <div class="user-avatar" >
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
            badge
            circle
            badge-color="success"
            badge-position="bottom-left"
            @click="activeProfile = !activeProfile"
          >
            <img
              v-bind:src="`${getProfile.avatar}`"
              v-if="getProfile.avatar"
              alt="profile image"
            />
            <template v-if="!getProfile.avatar" #text>
              {{ getProfile.username }}
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
                      />
                      <template v-if="!getProfile.avatar" #text>
                        {{ getProfile.username }}
                      </template>
                    </vs-avatar>
                  </div>

                  <h5 class="username-text">
                    {{ getProfile.username + "#" + getProfile.tag }}
                  </h5>
                  <vs-button main flat @click="settingScreen = !settingScreen">
                    Manage your account
                  </vs-button>
                </div>
              </div>
              <div class="prof-mid"></div>
              <div class="prof-bot"></div>

              <footer style="color: #626891" class="clickable">
                <p>Privacy policy</p>
              </footer>
            </div>
          </template>
        </vs-tooltip>
      </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
  },
  mounted() {
    this.$vs.theme = 'dark';
    console.log('DATA: ', this.getProfile.uid);
  },
  computed: {
    ...mapGetters(['isUserAuth', 'getProfile', 'getUser']),
    ...mapActions(['signOutAction']),
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/init.scss';
.main {
  // background-color: antiquewhite;
}
.navbar {
  background-color: $color_two;
}
.nav-select{
  width: 294px;
}

</style>
