<template>
  <div class="main">
    <section class="sidebar" ref="asyncImage">
      <div class="sidebar-content">
        <header>
          <router-link to="/">
            <div>
              <img
                class="title"
                src="../assets/partyapp_text_white.png"
                alt="party app title"
                draggable="false"
              />
            </div>
          </router-link>
        </header>
        <div class="side-art">
          <h2 class="side-art-subtitle">Never play alone</h2>
        </div>
      </div>
    </section>
    <section class="content">
      <nav class="level m-nav">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <!-- <h1 class="mobile-title roboto-r">PATRYAPP</h1> -->
          </div>
        </div>
      </nav>
      <nav class="auth-nav">
        <p class="auth-link">
          Need an account?<router-link to="Signup"> Signup</router-link>
        </p>
      </nav>
      <div class="content-main">
        <div class="auth-content">
          <h1 class="subtitle-color roboto-m">Sign in to PartyApp</h1>
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(emailauth)">
              <div class="auth-form">
                <div class="container">
                  <label for="uname">
                    <b class="subtitle-color">Email</b>
                  </label>
                  <ValidationProvider
                    name="email"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <b-field
                      class="field"
                      type="is-danger"
                      :message="errors[0]"
                    >
                      <vs-input
                        type="email"
                        v-model="email"
                        placeholder="Email"
                      />
                    </b-field>
                  </ValidationProvider>

                  <label for="psw">
                    <b class="subtitle-color">Password</b>
                    <p class="auth-forgot">
                      <router-link to="passreset">Forgot password</router-link>
                    </p>
                  </label>
                  <ValidationProvider
                    name="password"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <b-field
                      class="field"
                      type="is-danger"
                      :message="errors[0]"
                    >
                      <vs-input
                        type="password"
                        v-model="password"
                        placeholder="Password"
                      />
                    </b-field>
                  </ValidationProvider>

                  <div class="auth-buttons">
                    <button type="submit" class="button email-auth">
                      Login
                    </button>
                    <button
                      type="button"
                      class="button google-auth"
                      v-on:click="googleauth"
                    >
                      <span class="icon">
                        <i class="bx bxl-google" style="color: #ffffff"></i>
                      </span>
                    </button>
                  </div>
                  <p class="auth-link-phone">
                    <router-link to="Signup">Need an account?</router-link>
                  </p>
                </div>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
// import firebase from 'firebase/app';
// import { usersCollection } from '../firebaseConfig';

// No message specified.
extend('email', email);
// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required',
});

export default {
  metaInfo: {
    title: 'PartyApp',
    titleTemplate: '%s | Signin',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  components: {
    ValidationProvider,
  },
  methods: {
    ...mapActions(['signInAction', 'googleAuthAction']),
    loadImage(objs) {
      const imgs = objs.map((obj) => obj.url);
      imgs.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    },
    emailauth() {
      this.signInAction({ email: this.email, password: this.password })
        .then(() => {
          this.init();
        })
        .catch((e) => {
          this.openNotification('ERROR', e.message, 'danger');
        });
    },
    googleauth() {
      this.googleAuthAction().then(() => {
        this.init();
      });
    },
    init() {
      const loading = this.$vs.loading({
        type: 'corners',
        background: '#195bff',
        color: '#fff',
        opacity: '1',
        text: 'Checking you out, just a moment',
      });
      this.loadImage(this.getGames);
      setTimeout(() => {
        if (this.getProfile.flags) {
          this.$router.push('/crew/@me');
        } else {
          this.$router.push('/alpha');
        }
        loading.close();
      }, 1000);
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
  },
  mounted() {
    // // lazy loading image
    // // start to load iamge
    // const img = new Image();
    // img.src = this.$refs.asyncImage.dataset.src;
    // // Once image is loaded replace the src of the HTML element
    // img.onload = () => {
    //   this.$refs.asyncImage.style.backgroundImage = `url(${this.$refs.asyncImage.dataset.src})`;
    // };
    if (this.getEmail) {
      this.email = this.getEmail;
    }
  },
  computed: {
    ...mapGetters(['getProfile', 'getEmail', 'getGames']),
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 100vh;
  background-color: white;
}

.auth-nav {
  display: none;
}

.content {
  width: 100%;
}
.auth-content {
  width: 100%;
  max-width: 460px;
  margin: auto;
}
section {
  display: block;
}

.title {
  height: 38px;
}

label {
  margin: 0 0 8px;
}
.content-main {
  padding: 0 30px;
}

button {
  border-radius: 8px;
  border: none;
}
.auth-buttons {
  display: flex;
}
.email-auth {
  flex-grow: 1;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}
.google-auth {
  padding: 0 30px 0;
  margin-left: 18px;
  background-color: #4285f4;
}
.fa-google {
  color: #fafafa;
}
.auth-forgot {
  float: right;
}
.subtitle-color {
  color: #000000;
}

header {
  margin: 0 auto;
  max-width: 416px;
  padding: 48px 20px 0;
  text-align: left;
}
.side-art-subtitle {
  color: #fafafa;
  font-family: 'Roboto', sans-serif;
  font-size: 45px;
  font-weight: 700;
  padding: 0 30px;
}

// .test-sidebar{
//   flex-grow: 0;
//     width: 480px;
//     background: #2d2e30;
// }

.auth-nav {
  display: flex;
  justify-content: flex-end;
  flex-grow: 0;
  padding: 30px 30px 0;
  text-align: right;
}
.m-nav {
  display: none;
}

.sidebar {
  display: flex;
  position: relative;
  /* overflow: auto; */
  flex-grow: 0;
  width: 480px;
  background: #0C0200;
  color: #fafafa;
  background-image: url('../assets/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.side-art {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0;
}
.sidebar-content {
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0;
}
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  width: 100%;
}
.auth-content {
  margin: 0;
}

.content-main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0;
}
.auth-link-phone {
  display: none;
}

@media only screen and (max-width: 959px) {
  .sidebar {
    display: none;
  }
  .m-nav {
    margin: 20px;
  }
  .mobile-title {
    color: #000000;
  }
}
</style>
