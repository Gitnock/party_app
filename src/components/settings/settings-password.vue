<template>
  <div class="settings-password-main">

    <div class="content-main" v-if="!isGoogle">
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Current Password</h1>
          <h3 class="content-subtitle roboto-medium">
            Please type your current password
          </h3>
        </div>
        <input
          type="password"
          class="content-input"
          placeholder="*******************"
          v-model="password1"
          @input="isChanged"
        />
      </div>
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">New Password</h1>
          <h3 class="content-subtitle roboto-medium">
            Please type your new password
          </h3>
        </div>
        <input
          type="password"
          class="content-input"
          placeholder="*******************"
          v-model="password2"
          @input="isChanged"
        />
      </div>
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Confirm New Password</h1>
          <h3 class="content-subtitle roboto-medium">
            Please re-type your new password
          </h3>
        </div>
        <input
          type="password"
          class="content-input"
          placeholder="*******************"
          v-model="password3"
          @input="isChanged"
        />
      </div>
      <div class="content-container" v-if="isActive">
        <button class="content-save roboto-medium" @click="updateInfo">
          save
        </button>
      </div>
    </div>
    <div class="content-main" v-else>
      <div class="content-google" >
        <div class="con-google-main">
          <div>
            🔒 password locked, signed in with google, account provider linking coming soon...
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../firebaseConfig';

export default {
  name: 'settings-password-page',
  data() {
    return {
      password1: '',
      password2: '',
      password3: '',
      isActive: false,
      isGoogle: auth.currentUser.providerData[0].providerId === 'google.com',
    };
  },
  methods: {
    savesettings() {},
    isChanged() {
      if (
        this.password1.length > 7
        && this.password2.length > 7
        && this.password3.length > 7
        && this.password2 === this.password3
      ) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    openNotification(title, text, color) {
      this.$vs.notification({
        // flat: true,
        title,
        text,
        position: 'bottom-center',
        color,
      });
    },
    updateInfo() {
      const credential = auth.EmailAuthProvider.credential(
        auth.currentUser.email,
        this.password1,
      );

      auth.currentUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          // User re-authenticated.
          this.openNotification('success', 'worked', 'success');
        })
        .catch((error) => {
          // An error happened.
          this.openNotification('failed', error, 'danger');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';
</style>
