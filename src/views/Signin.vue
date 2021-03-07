<template>
  <div class="main">
    <section
      class="sidebar"
      ref="asyncImage"
      data-src="https://firebasestorage.googleapis.com/v0/b/mifiy-2c32c.appspot.com/o/assets%2Fweb%2Fauth%2Flarge%2Flogin.png?alt=media&token=3c2508d5-5498-425d-a6b5-d50c4817253c"
    >
      <div class="sidebar-content">
        <header>
          <router-link to="/">
            <div>
              <img
                class="title"
                src="../assets/partyapp_text_white.png"
                alt="m"
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
            <!-- <h1 class="mobile-title roboto-black">PATRYAPP</h1> -->
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
          <h1 class="subtitle-color roboto-medium">Sign in to PartyApp</h1>

          <form @submit.prevent="emailauth">
            <div class="auth-form">
              <div class="container">
                <label for="uname">
                  <b class="subtitle-color">Email</b>
                </label>
                <vs-input
                  type="text"
                  class="vv"
                  v-model="email"
                  placeholder="Email"
                />
                <label for="psw">
                  <b class="subtitle-color">Password</b>
                  <p class="auth-forgot">
                    <router-link to="passreset">Forgot password</router-link>
                  </p>
                </label>
                <vs-input
                  type="password"
                  v-model="password"
                  placeholder="Password"
                />

                <div class="auth-buttons">
                  <button type="submit" class="button email-auth">Login</button>
                  <button
                    type="button"
                    class="button google-auth"
                    v-on:click="googleauth"
                  >
                    <span class="icon">
                      <i class="fab fa-google" />
                    </span>
                  </button>
                </div>
                <p class="auth-link-phone">
                  <router-link to="Signup">Need an account?</router-link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
      error: '',
    };
  },
  methods: {
    ...mapActions(['signInAction', 'googleAuthAction']),
    emailauth() {
      this.signInAction({ email: this.email, password: this.password });
    },
    googleauth() {
      this.googleAuthAction();
    },
  },
  mounted() {
    // lazy loading image

    // start to load iamge
    const img = new Image();
    img.src = this.$refs.asyncImage.dataset.src;
    // Once image is loaded replace the src of the HTML element
    img.onload = () => {
      this.$refs.asyncImage.style.backgroundImage = `url(${this.$refs.asyncImage.dataset.src})`;
    };
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

@media (min-width: 960px) {
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
    // background: #2d2e30;
    color: #fafafa;
    background-image: url('https://firebasestorage.googleapis.com/v0/b/mifiy-2c32c.appspot.com/o/assets%2Fweb%2Fauth%2Fsmall%2Flogin-small.png?alt=media&token=9487c9e3-3c07-45a7-98c0-eba670324658');
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
