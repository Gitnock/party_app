<template>
  <div class="party-main">
    <div class="party-container">
      <div class="party-content">
        <div class="audio-layout">
          <audioLayout
            :muted="true"
            :user="getProfile"
          />
        </div>
        <div class="audio-layout" v-for="peer in peers" :key="peer.userId">
          <audioLayout
            :muted="false"
            :audioStream="peer.peerStream"
          />
        </div>
      </div>
    </div>
    <div class="party-options-container">
      <div class="party-options-content">
        <vs-avatar
          size="60"
          circle
          color="#202330"
          @click="mute"
          class="clickable"
        >
          <i class="bx bxs-microphone" v-if="muted" />
          <i class="bx bxs-microphone-off" v-else></i>
        </vs-avatar>
        <button class="hangup-btn" @click="hangUp">
          <img src="@/assets/hangup.svg" alt="" draggable="false" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import audioLayout from '@/components/call/audio.vue';
import { joinRoom } from 'trystero/src/firebase';
import { roomsCollection } from '../firebaseConfig';
// import firebase from 'firebase/app';
// import { getFireApp } from '../firebaseConfig';
// import { roomsCollection, rtDb } from '../firebaseConfig';
let room;
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'turn:18.118.49.54?transport=tcp',
      username: 'partyapp',
      credential: 'connect',
    },
  ],
};
const config = {
  appId: 'partyapp-9961f-default-rtdb',
  rtcConfig: configuration,
  rootPath: 'calls',
};

export default {
  data: () => ({
    roomId: '',
    peers: {},
    idsToUid: {},
    localStream: undefined,
    muted: true,
  }),
  components: {
    audioLayout,
  },
  methods: {
    ...mapActions(['setRoomUsersAction']),
    async getUserMedia() {
      try {
        // get user mic permissions and mic stream
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } catch (error) {
        // console.log(error);
        this.openNotification(
          'Error',
          'Permission denied. Refresh to try again.',
          'danger',
        );
      }

      // Show stream in HTML mic
      // this.$refs.localAudio.srcObject = this.localStream;
      // mute local audio
      // this.$refs.localAudio.volume = 0;
    },
    roomEvents() {
      room.onPeerJoin((id) => {
        this.openNotification('USER JOIN', `${id} joined`, 'success');
        room.addStream(this.localStream);
        this.initP(id);
      });
      room.onPeerStream((stream, id) => {
        // this.initPeer(id, this.idsToUid[id]);
        this.peers[id].peerStream = stream;
      });

      room.onPeerLeave((id) => {
        this.openNotification(
          'USER LEFT',
          `${this.idsToUid[id]} left`,
          'danger',
        );
        this.$delete(this.peers, id);
      });
    },
    mute() {
      this.muted = !this.muted;
      this.localStream.getAudioTracks()[0].enabled = this.muted;
    },
    hangUp() {
      room.leave();
      const tracks = this.localStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      Object.keys(this.peers).forEach((user) => {
        if (this.peers[user].peerStream) {
          this.peers[user].peerStream
            .getTracks()
            .forEach((track) => track.stop());
        }
        if (this.peers[user].pc) this.peers[user].pc.close();
      });
      this.peers = {};
      if (this.$route.path !== '/crew/@me') {
        this.$router.push('/crew/@me');
      }
    },
    leaveRoom() {
      room.leave();
    },
    initPeer(id, uid) {
      const user = this.getRoomUsers.find((x) => x.userId === uid);
      this.$set(this.peers, id, {
        userId: uid,
        peerStream: undefined,
        user,
      });
    },
    initP(id) {
      this.$set(this.peers, id, {
        userId: id,
        peerStream: undefined,
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
    async init() {
      this.roomId = this.$route.params.roomId;
      roomsCollection
        .doc(this.roomId)
        .get()
        .then(async (snap) => {
          if (snap.exists) {
            this.setRoomUsersAction({
              roomId: this.roomId,
              userId: this.getUser.uid,
            });
            await this.getUserMedia();
            room = joinRoom(config, this.roomId);
            this.roomEvents();
          } else {
            if (this.$route.path !== '/crew/@me') {
              this.$router.push('/crew/@me');
            }
            this.openNotification(
              'Error',
              `Party doesn't Exist${this.roomId}`,
              'danger',
            );
          }
        });
    },
    registerListeners() {

    },
  },
  computed: {
    ...mapGetters(['getUser', 'getRoomUsers', 'getProfile']),
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    const tracks = this.localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    Object.keys(this.peers).forEach((user) => {
      if (this.peers[user].peerStream) {
        this.peers[user].peerStream
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (this.peers[user].pc) this.peers[user].pc.close();
    });
    this.peers = {};
    room.leave();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.party-main {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.party-container {
  width: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.party-content {
  display: flex;
  // align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1248px;
}
.audio-layout {
  margin: 5px;
}

// OPITONS CONTAINER
.party-options-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.party-options-content {
  display: flex;
}
.hangup-btn {
  margin-left: 28px;
  height: 60px;
  width: 140px;
  border: none;
  border-radius: 50px;
  background-color: #fb4060;
}
@media only screen and (max-width: 628px) {
  .party-container {
    justify-content: flex-end;
    margin-bottom: 32px;
    flex-direction: column;
  }
  .audio-layout {
    margin: 5px 0px;
  }
  .party-main {
    padding: 0px;
  }
}
</style>
