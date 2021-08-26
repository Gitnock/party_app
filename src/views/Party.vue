<template>
  <div class="party-main">
    <div class="party-container">
      <div class="party-content">
        <div class="audio-layout">
          <audioLayout :muted="true" :user="getProfile" />
        </div>
        <div class="audio-layout fadeInAnim" v-for="peer in peers" :key="peer.userId">
          <audioLayout
            :muted="false"
            :audioStream="peer.peerStream"
            :user="peer.user"
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
import { joinRoom, selfId } from 'trystero/src/firebase';
import { roomsCollection, statusCollection } from '../firebaseConfig';
// import firebase from 'firebase/app';
// import { getFireApp } from '../firebaseConfig';
// import { roomsCollection, rtDb } from '../firebaseConfig';

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
    localStream: undefined,
    muted: true,
    room: null,
  }),
  components: {
    audioLayout,
  },
  methods: {
    ...mapActions(['setRoomUsersAction', 'bindRoomDataRef', 'setRoomIdAction']),
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
          'Mic permission denied. Refresh to try again.',
          'danger',
        );
      }

      // Show stream in HTML mic
      // this.$refs.localAudio.srcObject = this.localStream;
      // mute local audio
      // this.$refs.localAudio.volume = 0;
    },
    roomEvents() {
      this.room.onPeerJoin((id) => {
        // this.openNotification('USER JOIN', `${id} joined`, 'success');
        this.room.addStream(this.localStream);
        this.initPeer(id);
      });
      this.room.onPeerStream((stream, id) => {
        if (this.peers[id]) {
          this.peers[id].peerStream = stream;
        }
      });

      this.room.onPeerLeave((id) => {
        // this.openNotification(
        //   'USER LEFT',
        //   `${this.idsToUid[id]} left`,
        //   'danger',
        // );
        this.$delete(this.peers, id);
      });
    },
    mute() {
      this.muted = !this.muted;
      this.localStream.getAudioTracks()[0].enabled = this.muted;
    },
    statusEmpty() {
      this.updateStatus('still');
    },
    updateStatus(activity) {
      statusCollection.doc(this.getUser.uid).set({ activity }, { merge: true });
    },
    hangUp() {
      if (this.localStream !== undefined) {
        this.room.leave();
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
        this.statusEmpty();
      }
      if (this.$route.path !== '/crew/@me') {
        this.$router.push('/crew/@me');
      }
    },
    leaveRoom() {
      this.room.leave();
    },
    initPeer(id) {
      const user = this.getRoomUsers.find((x) => x.chatId === id);
      this.$set(this.peers, id, {
        userId: user.userId,
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
            await this.sendChatId();
            await this.setRoomUsersAction({
              roomId: this.roomId,
              userId: this.getUser.uid,
              gameId: this.getUserStatus.gameId,
            });

            await this.getUserMedia();
            this.room = joinRoom(config, this.roomId);
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
    async sendChatId() {
      await roomsCollection
        .doc(this.roomId)
        .collection('activePlayers')
        .doc(this.getUser.uid)
        .set({
          uid: this.getUser.uid,
          chatId: selfId,
        });
    },
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getRoomUsers',
      'getProfile',
      'getRoomUsersListener',
      'getUserStatus',
    ]),
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.localStream !== undefined) {
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

      this.room.leave();
    }
    this.getRoomUsersListener();
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
