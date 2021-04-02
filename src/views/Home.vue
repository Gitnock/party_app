<template>
  <div class="main">
    <topNav></topNav>
    <div class="main-content">
      <div class="party-types">
        <div class="host-content party-type-host">
          <div class="content-host-button roboto-medium">Host</div>
          <div class="content-container">
            <div class="content-text">
              <h1 class="content-title roboto-medium">Needed Players</h1>
              <h3 class="content-subtitle roboto-medium">
                select the amount of extra players needed for your party
              </h3>
            </div>
            <b-slider :min="1" :max="5" ticks v-model="players" rounded></b-slider>
          </div>
          <div class="content-container">
            <button class="content-create roboto-medium" >
              create
            </button>
          </div>
        </div>
        <button class="party-type-button party-type-join roboto-medium" @click="join">
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import topNav from '../components/nav.vue';

export default {
  components: {
    topNav,
  },
  data: () => ({
    voiceLink: '',
    players: 1,
  }),
  methods: {
    join() {
      this.$router.push('crew/123456789');
    },
    host() {

    },
  },
  computed: {
    ...mapActions(['joinGame', 'hostGame']),
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #2b2e43;
}
.main-content {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

//party buttons
.party-types {
  display: flex;
  flex-direction: column;
  // width: 798px;
  padding:12px;
}
.party-type-button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}
.party-type-host {
  color: white;
  background: #2f3247;
}
.party-type-join {
  color: #00cd69;
  background: #25514d;
}

//host content
.host-content {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 8px;
  max-height: 50px;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
}
.host-content:hover {
  max-height: 500px;
  transition: max-height 0.25s ease-in;
}

.content-host-button {
  width: 100%;
  height: 50px;
  background: #2f3247;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}
.content-input {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 12px;
  padding: 0px 12px;
  background: #2b2e43;
  color: white;
}
.content-create {
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 8px;
  background: #224168;
  font-size: 16px;
  color: #0291f4;
  margin-bottom: 12px;
}
.host-content:hover .content-host-button {
  display: none;
  transition: max-height 0.15s ease-out;
}
.content-container {
  margin-top: 12px;
  padding: 12px 84px;
}
.content-title {
  color: #b7bbd5;
  font-size: 24px;
  padding-bottom: 12px;
}
.content-subtitle {
  color: #626891;
  font-size: 16px;
  padding-bottom: 28px;
}
</style>
