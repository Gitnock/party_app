<template>
  <div class="main" @scroll.passive="onScroll">
    <div class="part1">
      <div class="section-nav">
        <div class="container-nav">
          <nav class="nav-left">
            <a
              ><img
                src="@/assets/partyapp_logo.svg"
                alt="partyapp logo"
                draggable="false"
            /></a>
          </nav>
          <nav class="nav-right">
            <div
              class="roboto-m auth-btn signin-btn clickable"
              @click="openSignin"
            >
              Sign in
            </div>
            <div
              class="roboto-m auth-btn signup-btn clickable"
              @click="openSignin"
            >
              Sign in
            </div>
            <button
              class="request-btn roboto-m nav-request-btn"
              @click="focusRequest"
            >
              Request access
            </button>
          </nav>
        </div>
      </div>
      <div class="part1-container">
        <div class="section-top">
          <div class="container-top">
            <h2 class="subtitle-index color-green roboto-m">PARTYAPP ALPHA</h2>
            <h1 class="title-index color-white roboto-m">
              Every match should have voice comms.
            </h1>
          </div>
        </div>
        <div class="section-mid">
          <div class="container-mid roboto-r">
            <div class="title-mid-container">
              <div class="title-mid">Easy as 1-2-3🎵</div>
            </div>
            <div class="card-container">
              <div class="card">
                <div class="card-top">
                  <h1 class="card-top-title roboto-mono-m">01</h1>
                </div>
                <div class="card-mid">
                  <h2 class="card-mid-title roboto-m">Choose your game</h2>
                </div>
                <div class="card-bot">
                  <img
                    src="@/assets/index/choose_game.png"
                    class="card-bot-img"
                    alt="choose game screen snippet"
                  />
                </div>
              </div>
              <div class="card">
                <div class="card-top">
                  <h1 class="card-top-title roboto-mono-m">02</h1>
                </div>
                <div class="card-mid">
                  <h2 class="card-mid-title roboto-m">Say hi</h2>
                </div>
                <div class="card-bot">
                  <img
                    src="@/assets/index/say_hi.png"
                    class="card-bot-img"
                    alt="mic unmute button snippet"
                  />
                </div>
              </div>
              <div class="card">
                <div class="card-top">
                  <h1 class="card-top-title roboto-mono-m">03</h1>
                </div>
                <div class="card-mid">
                  <h2 class="card-mid-title roboto-m">Copy a username</h2>
                </div>
                <div class="card-bot">
                  <img
                    src="@/assets/index/copy_username.png"
                    class="card-bot-img"
                    alt="copy ingame username button snippet"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-indicator-container">
      <div class="indicator-container">
        <i class="bx bxs-circle bx-fade-down indicator"></i>
      </div>
    </div>
    <div class="part2">
      <div class="section-bot" ref="sbot">
        <div class="container-bot">
          <h2 class="subtitle-index color-red roboto-m">EXPECT BUGS</h2>
          <h1 class="title-index color-black roboto-m">Less is more</h1>
          <h3 class="subtitle-small-index roboto-m">
            Partyapp is made for one thing and one thing only, to find you a
            party for the games you <span class="">love</span>
          </h3>
          <div class="request-container">
            <div class="request-input-container" id="emailContainer">
              <input
                type="text"
                class="request-input roboto-regular"
                placeholder="Enter your email"
                ref="email"
                v-model="email"
              />
              <button
                class="roboto-medium request-btn-desktop"
                @click="openSignup"
              >
                Submit
              </button>
            </div>
          </div>
          <div class="request-btn-container">
            <button
              class="request-btn-mobile roboto-medium"
              @click="openSignup"
            >
              Request access
            </button>
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
  </div>
</template>

<script>
export default {
  data: () => ({
    email: '',
    inputConChanged: true,
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
        const element = document.getElementById('emailContainer');
        element.classList.add('border-Anime');
        setTimeout(() => {
          element.classList.remove('border-Anime');
        }, 2000);
      }
    },
    onScroll() {
      const scroll = window.scrollTop;
      // const div = this.$refs.sbot;
      console.log('scroll: ', scroll);
      // if (window.scrollY > (div.offsetTop)) {
      //   console.log('scroll: ', div.offsetTop);
      // }
    },
  },
  mounted() {
    // window.addEventListener('scroll', console.log(window.scrollY));
  },
};
</script>

<style lang="scss" scoped>
//colors
.color-black {
  color: black;
}
.color-white {
  color: white;
}
.color-1 {
}
.color-2 {
}
.color-3 {
}
.color-green {
  color: #00cd69;
}
.color-red {
  color: #ff5441;
}
.main {
  background-color: #161823;
  height: 100%;
}

// PARTS
.part1 {
  height: 92% !important;
}
.part1-container {
  height: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
}
.part2{
  background-color: white;
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
.auth-btn {
  color: #b7bbd5;
  margin-right: 32px;
  &:hover {
    color: white;
  }
}
.signup-btn {
  display: none;
}
.request-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: #202330;
  color: white;
  transition: all 0.4s ease 0s;
  font-size: 16px;
}

// TOP
.section-top {
  padding: 48px 0;
  display: flex;
  justify-content: center;
}
.container-top {
  padding: 60px 90px 0px 90px;
  justify-content: center;
  align-items: center;
}
.title-index {
  font-size: 42px;
  text-align: center;
  line-height: 60px;
}
.subtitle-index {
  font-size: 18px;
  max-width: 480px;
  margin: auto;
  text-align: center;
  margin-bottom: 8px;
}
.subtitle-red {
}
.request-container {
  // background-color: wheat;
  display: flex;
  justify-content: center;
}
.request-input-container {
  width: 321px;
  height: 52px;
  border: none;
  background-color: #f4f7f8;
  border-radius: 8px;
  display: flex;
  padding: 8px;
  // margin: 32px;
}
.request-input {
  background-color: transparent;
  border: none;
  font-size: 16px;
  margin: 0 8px;
  // color: white;
  flex: 1 1 auto;
}
::placeholder {
  color: #464a65;
}
.request-btn-container {
  display: none;
}
.request-btn-desktop {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  background-color: #195bff;
  color: white;
  transition: all 0.4s ease 0s;
  font-size: 14px;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 20px rgba(25, 91, 255, 0.4);
  }
}
.request-btn-mobile {
  display: initial;
  align-items: center;
  width: 100%;
  width: 321px;
  height: 52px;
  border-radius: 8px;
  background-color: #195bff;
  border: none;
  color: white;
  font-size: 16px;
}
.border-Anime {
  animation: colorToDanger 2s 1;
}

// MID
.section-mid {
  margin: 0 0 32px;
  display: flex;
  justify-content: center;
}
.container-mid {
  max-width: 1248px;
}
.title-mid-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}
.title-mid {
  background-color: #202330;
  border-radius: 8px;
  padding: 4px 12px;
  color: #b7bbd5;
  font-size: 16px;
  display: inline-block;
}
.scroll-indicator-container {
  display: flex;
  justify-content: center;
  // margin: 142px 0px 12px;
  height: 8% !important;
}
.indicator-container {
  background-color: #2f3247;
  height: 42px;
  display: flex;
  justify-content: center;
  padding: 4px 4px 4px 4px;
  border-radius: 12px;
}
.indicator {
  color: #b7bbd5;
}
.card-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  width: 321px;
  height: 382px;
  margin: 8px;
  border: none;
  border-radius: 16px;
  background-color: #202330;
  padding: 18px;
  box-shadow: none;
}
.card-top {
  display: inline;
}
.card-top-title {
  color: #464a65;
  font-size: 36px;
}
.card-mid {
  margin: 4px 0;
}
.card-mid-title {
  color: #b7bbd5;
  font-size: 21px;
  text-align: left;
}
.card-bot {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}
.card-bot-img {
  border: none;
  width: 282px;
  height: 246px;
  border-radius: 12px;
  background-color: #161823;
}

// BOT
.section-bot {
  padding: 60px 90px 0px 90px;
  padding: 48px 0;
  display: flex;
  justify-content: center;
}
.container-bot {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.subtitle-small-index {
  font-size: 20px;
  max-width: 454px;
  padding: 4px 12px;
  text-align: center;
  margin-bottom: 32px;
  color: #2f3247;
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
  .part1 {
    height: auto !important;
  }
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
  .part1 {
    height: auto !important;
  }
  // .nav-right {
  //   display: none;
  // }
  .nav-request-btn {
    display: none;
  }
  .signup-btn {
    display: block;
  }
  .signin-btn {
    display: none;
  }
  .title-index {
    font-size: 48px;
  }
  .container-top {
    padding: 32px 12px 0px;
  }
}
@media screen and (max-height: 900px) {
  .part1 {
    height: auto !important;
  }
}
</style>
