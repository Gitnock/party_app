<template>
  <div class="main">
    <div class="section-nav">
      <div class="container-nav">
        <nav class="nav-left">
          <a
            ><img
              src="@/assets/partyapp_logo.svg"
              alt="partyapp logo"
              class="logo-attio"
          /></a>
        </nav>
        <nav class="nav-right">
          <div class="roboto-medium signin-btn clickable" @click="openSignin">
            Sign in
          </div>
          <button class="request-btn roboto-medium" @click="focusRequest">
            Request access
          </button>
        </nav>
      </div>
    </div>
    <div class="section-top">
      <div class="container-top">
        <h1 class="title-index roboto-medium">Party-App with us.</h1>
        <h2 class="subtitle-index roboto-medium">
          PartyApp helps you find and join cool and interesting people while
          playing the games you love.
        </h2>
        <div class="request-container">
          <div class="request-input-container">
            <input
              type="text"
              class="request-input roboto-regular"
              placeholder="Enter your email"
              ref="email"
              v-model="email"
            />
            <button
              class="request-btn roboto-medium request-btn-desktop"
              @click="openSignup"
            >
              Request access
            </button>
          </div>
        </div>
        <div class="request-btn-container">
          <button class="request-btn-mobile roboto-medium" @click="openSignup">
            Request access
          </button>
        </div>
      </div>
    </div>
    <div class="section-mid">
      <div class="container-mid roboto-regular">
        <div class="title-mid-container">
          <div class="title-mid">Easy as 1-2-3🎵</div>
        </div>
        <div class="card-container">
          <div class="card">
            <div class="card-top">
              <h1 class="card-top-title">1.</h1>
            </div>
            <div class="card-mid">
              <h2 class="card-mid-title">
                Choose your game.
                <p class="card-mid-subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </h2>
            </div>
            <div class="card-bot">
              <div class="card-bot-img"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-top">
              <h1 class="card-top-title">2.</h1>
            </div>
            <div class="card-mid">
              <h2 class="card-mid-title">
                Say hi.
                <p class="card-mid-subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </h2>
            </div>
            <div class="card-bot">
              <div class="card-bot-img"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-top">
              <h1 class="card-top-title">3.</h1>
            </div>
            <div class="card-mid">
              <h2 class="card-mid-title">
                Add some body.
                <p class="card-mid-subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </h2>
            </div>
            <div class="card-bot">
              <div class="card-bot-img"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-footer">
      <div class="container-footer">
        <div class="footer-legal">
          <p>© 2021 PartyApp.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: '',
  }),
  methods: {
    openSignup() {
      // eslint-disable-next-line
      const emailVal = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;
      if (this.email.length > 0 && emailVal.test(this.email)) {
        this.$store.commit('setEmail', this.email);
        this.$router.push('/signup');
      } else {
        this.openNotification('Error', 'Hey, is that a email?', 'danger');
      }
    },
    openSignin() {
      this.$router.push('/signin');
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
    focusRequest() {
      // eslint-disable-next-line
      const emailVal = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;
      if (this.email.length > 0 && emailVal.test(this.email)) {
        this.$store.commit('setEmail', this.email);
        this.$router.push('/signup');
      } else {
        this.$refs.email.focus();
        this.openNotification('Error', 'Enter your email', 'danger');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #161823;
  height: 100vh;
  overflow: auto;
}

// NAV
.section-nav {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-nav {
  // background-color: brown;
  max-width: 1320px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
}
.nav-right {
  display: flex;
  align-items: center;
}
.signin-btn {
  color: #b7bbd5;
  margin-right: 32px;
  &:hover {
    color: white;
  }
}
.request-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: #195bff;
  color: white;
  transition: all 0.4s ease 0s;
  font-size: 16px;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 20px rgba(25, 91, 255, 0.4);
  }
}

// TOP
.section-top {
  padding: 82px 0;
  display: flex;
  justify-content: center;
}
.container-top {
  padding: 60px 90px 0px 90px;
  justify-content: center;
  align-items: center;
}
.title-index {
  font-size: 64px;
  color: white;
  margin-bottom: 24px;
  text-align: center;
  line-height: 60px;
}
.subtitle-index {
  font-size: 21px;
  color: #b7bbd5;
  max-width: 480px;
  opacity: 0.6;
  margin: auto;
  text-align: center;
  margin-bottom: 32px;
}
.request-container {
  // background-color: wheat;
}
.request-input-container {
  max-width: 382px;
  width: 100%;
  height: 52px;
  margin: auto;
  border: 1px solid rgba(183, 187, 213, 0.4);
  border-radius: 12px;
  display: flex;
  padding: 2px;
}
.request-input {
  background-color: transparent;
  border: none;
  font-size: 16px;
  margin: 0 8px;
  color: white;
  flex: 1 1 auto;
}
::placeholder {
  color: #464a65;
}
.request-btn-container {
  display: none;
}

.request-btn-mobile {
  display: initial;
  align-items: center;
  width: 100%;
  max-width: 382px;
  height: 52px;
  border-radius: 8px;
  background-color: #195bff;
  border: none;
  color: white;
  font-size: 16px;
}

// MID
.section-mid {
  margin: 60px 0;
  display: flex;
  justify-content: center;
}
.container-mid {
  max-width: 1248px;
}
.title-mid-container {
  display: flex;
  justify-content: center;
  margin-bottom: 52px;
}
.title-mid {
  background-color: transparent;
  border: 1px solid rgba(183, 187, 213, 0.4);
  border-radius: 8px;
  padding: 4px 12px;
  color: #b7bbd5;
  font-size: 16px;
  display: inline-block;
}
.card-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  width: 345px;
  height: 415px;
  margin: 8px;
  border: none;
  border-radius: 16px;
  background-color: #202330;
  padding: 22px;
}
.card-top {
  display: inline;
}
.card-top-title {
  color: #b7bbd5;
  font-size: 28px;
}
.card-mid {
  margin: 4px 0;
}
.card-mid-title {
  color: white;
  font-size: 21px;
  text-align: left;
}
.card-mid-subtitle {
  display: inline;
  color: #b7bbd5;
}
.card-bot {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
.card-bot-img {
  border: none;
  width: 236px;
  height: 179px;
  border-radius: 12px;
  background-color: #2b2e43;
}

//FOOTER
.section-footer {
  // display: flex;
  // justify-content: center;
}
.container-footer {
  position: relative;
  max-width: 1248px;
  margin-right: auto;
  margin-left: auto;
  padding: 4rem 2rem 2rem;
}
.footer-legal {
  color: #b7bbd5;
}

// MOBILE
@media only screen and (max-width: 705px) {
  .title-index {
    font-size: 52px;
  }
  .request-btn-desktop {
    display: none;
  }

  .request-btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px 0px;
    animation: 0.3s ease-out 0s 1 slideInFromTop;
  }
}
@media only screen and (max-width: 607px) {
  .nav-right {
    display: none;
  }
  .title-index {
    font-size: 48px;
  }
  .container-top {
    padding: 32px 12px 0px;
  }
}

// animation
@keyframes slideInFromTop {
  0% {
    transform: translateY(-52%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
