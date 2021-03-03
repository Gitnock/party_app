<template>
  <div class="main">
    <Nav></Nav>
    <div class="main-content">
      <div class="party-types">
        <div class="host-content party-type-host">
          <div class="content-host-button roboto-medium">Host</div>
          <div class="content-container">
            <div class="content-text">
              <h1 class="content-title roboto-medium">Discord Voice Link</h1>
              <h3 class="content-subtitle roboto-medium">
                Copy the discord voice channel link
              </h3>
            </div>
            <input type="text" class="content-input" v-model="voiceLink" />
          </div>
          <div class="content-container">
            <div class="content-text">
              <h1 class="content-title roboto-medium">Needed Players</h1>
              <h3 class="content-subtitle roboto-medium">
                select the amount of extra players need for your party
              </h3>
            </div>
            <input
              type="number"
              class="content-input"
              v-model="players"
              min="1"
              max="5"
            />
          </div>
          <div class="content-container">
            <button class="content-save roboto-medium" @click="updateInfo">
              save
            </button>
          </div>
        </div>
        <button class="party-type-button party-type-join roboto-medium">
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '../components/home/nav.vue';

export default {
  components: {
    Nav,
  },
  data: () => ({
    voiceLink: '',
    players: 0,
  }),
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
  width: 798px;
}
.party-type-button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 8px;
  margin: 8px;
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
  margin: 8px;
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
  padding: 0px 8px;
  background: #2b2e43;
  color: white;
}
.content-save {
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 8px;
  padding: 12px;
  background: #224168;
  font-size: 16px;
  color: #0291F4;
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
