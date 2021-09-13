<template>
  <div class="main" ref="main">
    <div class="part1" ref="part1">
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

      <footer class="section-footer">
        <div class="container-footer roboto-mono-m">
          <div class="footer-rights">
            <p>© 2021 PartyApp.</p>
          </div>
          <div class="footer-legal">
            <div class="legal-Terms">
              <p>Terms & Conditions</p>
            </div>
            <div class="legal-Privacy">
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: '',
    inputConChanged: true,
    isDark: false,
  }),
  methods: {
    openSignup() {
      // eslint-disable-next-line
      const eVal = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;
      if (this.email.length > 0 && eVal.test(this.email)) {
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
      const eVal = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;
      if (this.email.length > 0 && eVal.test(this.email)) {
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
    // onScroll() {
    //   const isMobile = window.matchMedia('(max-width: 700px)').matches;
    //   const { part1 } = this.$refs;
    //   if (!isMobile) {
    //     this.isDark = !this.inViewport(part1);
    //   }
    // },
    // inViewport(element) {
    //   const bounds = element.getBoundingClientRect();
    //   const viewWidth = document.documentElement.clientWidth;
    //   const viewHeight = document.documentElement.clientHeight;

    //   if (bounds.left < 0) return false;
    //   if (bounds.top < 0) return false;
    //   if (bounds.right > viewWidth) return false;
    //   if (bounds.bottom > viewHeight) return false;

    //   return true;
    // },
  },
  mounted() {
    // window.addEventListener('scroll', console.log(window.scrollY));
  },
  watch: {
    // isDark(nVal) {
    //   const { main } = this.$refs;
    //   if (nVal) {
    //     main.classList.remove('dark');
    //     main.classList.add('light');
    //   } else {
    //     main.classList.remove('light');
    //     main.classList.add('dark');
    //   }
    // },
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
.color-green {
  color: #00cd69;
}
.color-red {
  color: #ff5441;
}
.main {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
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
.part2 {
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
  justify-content: flex-end;
  align-items: center;
}
.auth-btn {
  color: $c5_dark;
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
  background-color: $c2_dark;
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
  background-color: $c2_dark;
  border-radius: 8px;
  padding: 4px 12px;
  color: $c5_dark;
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
  background-color: $c3_dark;
  height: 42px;
  display: flex;
  justify-content: center;
  padding: 4px 4px 4px 4px;
  border-radius: 12px;
}
.indicator {
  color: $c5_dark;
}
.card-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  width: 321px;
  margin: 8px;
  border: none;
  border-radius: 16px;
  background-color: $c2_dark;
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
  color: $c5_dark;
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
  background-color: c1_dark;
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
  color: $c3_dark;
}

//FOOTER
.section-footer {
  // display: flex;
  // justify-content: center;
}
.container-footer {
  color: $c1_dark;
  position: relative;
  max-width: 1248px;
  margin-right: auto;
  margin-left: auto;
  padding: 4rem 2rem 2rem;
  display: flex;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}
.footer-legal {
  display: flex;
}
.legal-Terms {
  &:hover{
      color: $cg_front;
       text-decoration: underline;
    }
}
.legal-Privacy {
  margin-left: 32px;
  &:hover{
      color: $cg_front;
       text-decoration: underline;
    }
}

// THEME
// @mixin theme($theme-name, $c1, $c2, $c3,$c4,$title) {
//   .#{$theme-name} {
//     background: $c1;
//     transition: background-color 0.3s ease;
//     .title-index{
//        color: $title;
//        transition: color 0.3s ease;
//       }
//     .title-mid{
//       background-color: $c2;
//       transition: background-color 0.3s ease;
//     }
//     .card {
//       background-color: $c2;
//       transition: background-color 0.3s ease;
//       .card-top-title{
//         color: $c3;
//       }
//       .card-mid-title{
//         color: $c4;
//       }
//     }
//     .indicator-container{
//       background-color: $c2;
//       transition: background-color 0.2s ease;
//     }
//   }
// }
// @include theme(dark, $c1_dark, $c2_dark, $c4_dark,$c5_dark,white);
// @include theme(light, $c1_light, $c2_light, $c3_light,$c4_dark,black);

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
  .auth-btn {
    margin-right: 0;
  }
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
  .footer-legal {
    width: 100%;
    justify-content: space-between;
  }
  .footer-rights {
    display: none;
  }
}
@media screen and (max-height: 900px) {
  .part1 {
    height: auto !important;
  }
  .container-top {
    padding: 32px 12px 0px;
  }
  .scroll-indicator-container {
    margin-bottom: 32px;
  }
}
</style>
