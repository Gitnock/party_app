<template>
  <div class="settings-account-main">
    <div class="content-main">
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Birth Date</h1>
          <h3 class="content-subtitle roboto-medium">
            Your birthdate is always private
          </h3>
        </div>
        <input
          placeholder="Date"
          class="content-input"
          type="text"
          onfocus="(this.type='date')"
          id="date"
          :min="minDate"
          :max="maxDate"
          @input="isChanged(`date`)"
        />
      </div>
      <div class="content-container" v-if="!isGoogle">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Email</h1>
          <h3 class="content-subtitle roboto-medium">
            Don't worry we won't go crazy
          </h3>
        </div>
        <input
          type="email"
          class="content-input"
          :placeholder="userProfile.email"
          v-model="email"
          @input="isChanged(`email`)"
        />
      </div>
      <div class="content-google" v-else>
        <div class="con-google-main">
          <div>
            🔒 email locked, signed in with google, account provider linking
            coming soon...
          </div>
        </div>
      </div>
      <!-- <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Sex</h1>
          <h3 class="content-subtitle roboto-medium">
            Google "sex chromosomes"
          </h3>
        </div>
        <select class="content-sex" v-model="sex">
          <option value="female">XX</option>
          <option value="male">XY</option>
          <option value="other">Other</option>
        </select>
      </div> -->
      <div class="content-container" v-if="isActive">
        <button class="content-save roboto-medium">save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { auth, usersCollection } from '../../firebaseConfig';

export default {
  name: 'settings-account-page',
  data() {
    const today = new Date();
    return {
      email: '',
      sex: '',
      minDate: new Date(
        today.getFullYear() - 80,
        today.getMonth(),
        today.getDate(),
      ),
      maxDate: new Date(
        today.getFullYear() + 13,
        today.getMonth(),
        today.getDate(),
      ),
      isActive: false,
      isGoogle: auth.currentUser.providerData[0].providerId === 'google.com',
    };
  },
  methods: {
    savesettings() {},
    init() {
      this.sex = this.userProfile.sex;
    },
    isChanged(type) {
      if (type === 'email') {
        // eslint-disable-next-line
        const emailVal = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;
        if (this.email.length > 0 && emailVal.test(this.email)) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
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
      auth.currentUser
        .updateEmail(this.email)
        .then(() => {
          // Update successful.
          usersCollection
            .doc(this.currentUser.uid)
            .update({
              email: this.email,
            })
            .then(() => {
              this.openNotification('Success', 'email was updated', 'success');
              this.email = '';
            });
        })
        .catch((error) => {
          // An error happened.
          this.openNotification('failed', error, 'danger');
        });
    },
  },
  mounted() {
    this.init();

    // const profile = auth.currentUser.providerData;
    // console.log(`Sign-in provider: ${profile[0].providerId}`);
  },
  computed: {
    ...mapState(['userProfile']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';
</style>
