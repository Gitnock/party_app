<template>
  <div class="main">
    <section
      class="sidebar"
      ref="asyncImage"
    >
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
          <h2 class="side-art-subtitle">Need a player Two</h2>
        </div>
      </div>
    </section>
    <section class="content">
      <nav class="level m-nav">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <!-- <h1 class="mobile-title roboto-black">PARTYAPP</h1> -->
          </div>
        </div>
      </nav>
      <nav class="auth-nav">
        <p class="auth-link">
          Already a member?
          <router-link to="Signin">login</router-link>
        </p>
      </nav>
      <div class="content-main">
        <div class="auth-content">
          <h1 class="subtitle-color roboto-medium">Sign up to PartyApp</h1>
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(emailauth)">
              <div class="auth-form">
                <div class="container">
                  <label for="username">
                    <b>Username</b>
                  </label>
                  <ValidationProvider
                    name="username"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <b-field
                      class="field"
                      type="is-danger"
                      :message="errors[0]"
                    >
                      <vs-input
                        v-model="username"
                        placeholder="Username"
                        maxlength="15"
                      />
                    </b-field>
                  </ValidationProvider>

                  <label for="email">
                    <b>Email</b>
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
                        maxlength="125"
                        autocomplete="email"
                      />
                    </b-field>
                  </ValidationProvider>

                  <label for="psw">
                    <b>Password</b>
                  </label>

                  <ValidationProvider
                    name="password"
                    rules="required|min:8"
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
                        maxlength="30"
                      />
                    </b-field>
                  </ValidationProvider>

                  <div class="auth-buttons">
                    <button class="button email-auth">Continue</button>
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
                    <router-link to="Signin">
                      Already have an account?</router-link
                    >
                  </p>
                  <p class="auth-terms">
                    By registering, you agree to Mifiy's
                    <router-link to="Signup">Terms of Service</router-link>
                    and
                    <router-link to="Signup">Privacy Policy</router-link>
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

<style lang="scss" scoped>
.error {
  color: red;
  font-size: 18px;
}
.main {
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
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
  color: white;
}
.column {
  margin: 0px;
}
.columns {
  margin-bottom: 0;
}
.auth-terms {
  margin-top: 12px;
  font-size: 12px;
  color: #4a4a4a;
}
.columns:not(:last-child) {
  margin-bottom: 0%;
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

.sex-auth {
  background-color: #26272b;
  border-radius: 8px;
  color: #fafafa;
  height: 34px;
  border: none;
  width: 100%;
}

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
    flex-grow: 0;
    width: 480px;
    // background: #2d2e30;
    // color: #865c6c;
    background-image: url('../assets/signup.png');
    background-position: center;
    background-size: cover;
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
  .side-art-subtitle {
    color: #fafafa;
    font-family: 'Roboto', sans-serif;
    font-size: 45px;
    font-weight: 700;
    padding: 0 30px;
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

<script>
import { ValidationProvider, extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';

import { mapActions, mapGetters } from 'vuex';

// No message specified.
extend('email', email);
extend('min', {
  ...min,
  message: 'min of 8 length',
});
// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required',
});

export default {
  metaInfo: {
    title: 'PartyApp',
    titleTemplate: '%s | Signup',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  components: {
    ValidationProvider,
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['signUpAction', 'googleAuthAction']),
    loadImage(objs) {
      const imgs = objs.map((obj) => obj.url);
      imgs.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    },
    emailauth() {
      this.signUpAction({
        email: this.email,
        password: this.password,
        username: this.username,
      }).then(() => {
        this.init();
      }).catch((e) => {
        this.openNotification('ERROR', e.message, 'danger');
      });
    },
    googleauth() {
      this.googleAuthAction().then(() => {
        this.init();
      });
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
  },
  computed: {
    ...mapGetters(['getEmail', 'getProfile', 'getGames']),
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
};
</script>
