<template>
  <div class="audio-container">
    <audio :srcObject.prop="audioStream" autoplay v-if="!isMain" />
    <div class="audio-muted" v-if="muted">
      <vs-avatar circle color="#2B2E43">
        <i class="bx bx-volume-mute"></i>
      </vs-avatar>
    </div>
    <div class="audio-content" v-if="user">
      <vs-avatar
        size="96"
        circle
        color="#2B2E43"
        class="user-avatar clickable"
        @click="muted = !muted"
        :history="volume > 20"
      >
        <img
          v-bind:src="`${user.avatar}`"
          v-if="user.avatar"
          alt="profile image"
          draggable="false"
        />
        <template v-if="!user.avatar && user.username" #text>
          {{ user.username.charAt(0) }}
        </template>
      </vs-avatar>
    </div>
    <userInfo :user="user" :copy="copy"/>
  </div>
</template>

<script>
import * as workerTimers from 'worker-timers';
import userInfo from './userInfo.vue';

export default {
  name: 'audioLayout',
  data: () => ({
    usernameChar: '',
    volumeInterval: null,
    volume: 0,
  }),
  components: {
    userInfo,
  },
  props: {
    muted: Boolean,
    audioStream: MediaStream,
    isMe: Boolean,
    user: Object,
    copy: Boolean,
    isMain: Boolean,
  },
  methods: {
    handleSoundIndicator() {
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(this.audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.minDecibels = -127;
      analyser.maxDecibels = 0;
      analyser.smoothingTimeConstant = 0.4;
      audioSource.connect(analyser);
      const volumes = new Uint8Array(analyser.frequencyBinCount);
      this.submitTimer = workerTimers.setInterval(() => {
        analyser.getByteFrequencyData(volumes);
        let volumeSum = 0;
        volumes.forEach((volume) => {
          volumeSum += volume;
        });
        const averageVolume = volumeSum / volumes.length;
        this.volume = (averageVolume * 100) / 127;
      }, 100);
    },
  },
  watch: {
    audioStream() {
      this.handleSoundIndicator();
    },
  },
  beforeDestroy() {
    if (this.submitTimer != null) {
      workerTimers.clearInterval(this.submitTimer);
      this.submitTimer = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.audio-container {
  width: 322px;
  height: 218px;
  background: $c2_dark;
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

//vs-avatar
div.vs-avatar-content{
  z-index: initial !important;
}
div.vs-avatar-content.history{
  border: 2px solid rgba(48, 209, 88, 1) !important;
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
