<template>
  <div class="audio-container">
    <audio :srcObject.prop="audioStream" />
    <div class="audio-muted" v-if="!muted">
      <vs-avatar
        circle
        color="#161823"
        @click="curGame = null"
        class="clickable"
      >
        <i class="bx bx-volume-mute"></i>
      </vs-avatar>
    </div>
    <div class="audio-content">
      <vs-avatar size="96" circle color="#161823" class="user-avatar">
        <img
          v-bind:src="`${user.avatar}`"
          v-if="user.avatar"
          alt="profile image"
        />
        <template v-if="!user.avatar" #text>
          {{ user.username }}
        </template>
      </vs-avatar>
    </div>
    <userInfo :user="user"/>
  </div>
</template>

<script>
import userInfo from './userInfo.vue';

export default {
  name: 'audioLayout',
  data: () => ({}),
  components: {
    userInfo,
  },
  props: {
    muted: Boolean,
    audioStream: MediaStream,
    isMe: Boolean,
    user: Object,
  },
};
</script>

<style lang="scss" scoped>
.audio-container {
  width: 322px;
  height: 218px;
  background: #202330;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.audio-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: 48px;
  // background-color: aquamarine;
}
.audio-muted {
  padding: 12px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1000;
}
@media only screen and (max-width: 628px) {
  .audio-container {
    flex-direction: row;
    position: relative;
    height: auto;
  }
  .audio-muted {
    display: none;
  }
  div.user-avatar {
    height: 40px !important;
    width: 40px !important;
  }
  .audio-content {
    flex: none;
    display: flex;
    justify-content: center;
    padding-top: 0;
    margin-right: 12px;
    // background-color: aquamarine;
  }
}
</style>
