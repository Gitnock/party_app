<template>
  <div class="settings-account-main">
    <div class="content-main">
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-m">Birth Date</h1>
          <h3 class="content-subtitle roboto-m">
            Your birthdate is always private
          </h3>
        </div>
        <input
          placeholder="Private"
          class="content-input"
          type="text"
          onfocus="(this.type='date')"
          id="date"
          :min="minDate"
          :max="maxDate"
          v-model="date"
          @input="isChanged(`date`)"
        />
      </div>
      <div class="content-container" v-if="!isGoogle">
        <div class="content-text">
          <h1 class="content-title roboto-m">Email</h1>
          <h3 class="content-subtitle roboto-m">
            Don't worry we won't go crazy
          </h3>
        </div>
        <input
          type="email"
          class="content-input"
          placeholder="private"
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
          <h1 class="content-title roboto-m">Sex</h1>
          <h3 class="content-subtitle roboto-m">
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
        <button class="content-save roboto-m" @click="updateInfo">save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase/app';
import { auth, userDataCollection } from '../../firebaseConfig';

export default {
  name: 'settings-account-page',
  data() {
    return {
      email: '',
      sex: '',
      date: '',
      minDate: '',
      maxDate: '',
      isActive: false,
      isGoogle: auth.currentUser.providerData[0].providerId === 'google.com',
    };
  },
  methods: {
    savesettings() {},
    init() {
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
      } else if (this.date) {
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
      if (!this.date) {
        auth.currentUser
          .updateEmail(this.email)
          .then(() => {
            // Update successful.
            userDataCollection
              .doc(this.getUser.uid)
              .update({
                email: this.email,
              })
              .then(() => {
                this.openNotification(
                  'Success',
                  'email was updated',
                  'success',
                );
                this.email = '';
              });
          })
          .catch((error) => {
            // An error happened.
            this.openNotification('failed', error, 'danger');
          });
      } else {
        const myTimestamp = firebase
          .firestore
          .Timestamp
          .fromDate(new Date(this.date));
        userDataCollection
          .doc(this.getUser.uid)
          .update({
            dob: myTimestamp,
          })
          .then(() => {
            this.openNotification(
              'Success',
              'Date of birth was updated',
              'success',
            );
          }).catch((e) => {
            console.log(e);
          });
      }
    },
    formatDate(date) {
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) {
        month = `0${month}`;
      }
      if (day.length < 2) {
        day = `0${day}`;
      }

      return [year, month, day].join('-');
    },
  },
  mounted() {
    this.init();
    const today = new Date();
    this.minDate = this.formatDate(
      new Date(today.getFullYear() - 80, today.getMonth(), today.getDate()),
    );
    this.maxDate = this.formatDate(
      new Date(today.getFullYear() - 13, today.getMonth(), today.getDate()),
    );
    // const profile = auth.currentUser.providerData;
    // console.log(`Sign-in provider: ${profile[0].providerId}`);
  },
  computed: {
    ...mapGetters(['getUser']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';
</style>
