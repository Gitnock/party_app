<template>
  <div class="call-main">
    <div class="call-container">
      <div class="call-content">
        <div class="audio-layout">
          <audioLayout
            :audioStream="localStream"
            :muted="true"
            :user="getProfile"
            :copy="false"
            :isMain="true"
          />
        </div>
        <div
          class="audio-layout fadeInAnim"
          v-for="peer in peers"
          :key="peer.userId"
        >
          <audioLayout
            :muted="false"
            :audioStream="peer.peerStream"
            :user="peer.user"
            :copy="true"
            :isMain="false"
          />
        </div>
      </div>
    </div>
    <div class="call-options-container">
      <div class="call-options-content">
        <vs-avatar
          size="60"
          circle
          color="#2B2E43"
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
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true },
          video: false,
        });
      } catch (error) {
        this.openNotification(
          'Error',
          'Mic permission denied. Refresh to try again.',
          'danger',
        );
      }
    },
    roomEvents() {
      this.room.onPeerJoin((id) => {
        this.room.addStream(this.localStream);
        this.initPeer(id);
      });
      this.room.onPeerStream((stream, id) => {
        if (this.peers[id]) {
          this.peers[id].peerStream = stream;
        }
      });

      this.room.onPeerLeave((id) => {
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
              roomType: 'rooms',
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
@import '@/assets/styles/call.scss';
</style>
