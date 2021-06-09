<template>
  <div class="main">
    <div class="party-content">
      <div class="columns is-multiline">
        <div class="column">
          <button @click="hangUp">hangup</button>
        </div>
        <div class="column">
          <audio controls ref="localAudio" muted />
        </div>
      </div>
      <div>
        <div v-for="peer in peers" :key="peer.userId">
          <div>{{ peer.userId }}</div>
          <!-- srcObject is a modifier not a html attribute, so you need to write -->
          <audio autoplay controls :srcObject.prop="peer.peerStream" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import firebase from 'firebase/app';
import { db, roomsCollection } from '../firebaseConfig';

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      url: 'turn:18.118.49.54:3478?transport=udp',
      credential: 'partyapp',
      username: 'connect',
    },
  ],
  iceCandidatePoolSize: 2,
};

export default {
  data: () => ({
    roomId: '',
    peers: {},
    localStream: undefined,
  }),
  methods: {
    async init() {
      await this.getUserMedia();
      this.roomId = this.$route.params.roomId;
      roomsCollection
        .doc(this.roomId)
        .get()
        .then(async (snap) => {
          if (snap.exists) {
            // await this.userLeft();
            await this.userJoined();
            this.listenNewUsers();
            this.listenNewConnections();
          } else {
            this.$router.push('/app');
            this.openNotification(
              'Error',
              `Party doesn't Exist${this.roomId}`,
              'danger',
            );
          }
        });
    },
    async getUserMedia() {
      try {
        // get user mic permissions and mic stream
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: {
            sampleSize: 16,
            channelCount: 2,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: false,
          },
        });
      } catch (error) {
        console.log(error);
        this.openNotification(
          'Error',
          'Permission denied. Refresh to try again.',
          'danger',
        );
      }

      // Show stream in HTML mic
      this.$refs.localAudio.srcObject = this.localStream;
      // mute local audio
      this.$refs.localAudio.volume = 0;
    },
    async createOffer(peer, from, to) {
      const connectionsCollection = roomsCollection
        .doc(this.roomId)
        .collection('connections');

      const connectionRef = connectionsCollection.doc(`user${from}user${to}`);

      this.registerPeerConnectionListeners(peer.pc, to);
      // setting local track in connection
      this.localStream.getTracks().forEach((track) => {
        peer.pc.addTrack(track, this.localStream);
      });

      // Get candidates for caller, save to db
      const callerCandidatesCollection = connectionRef.collection('callerCandidates');
      peer.pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          callerCandidatesCollection.doc('candidate').set(json);
        }
      });

      // create offer and storing offer
      const offer = await peer.pc.createOffer();

      await peer.pc.setLocalDescription(offer);

      const connectionWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        from,
        to,
      };
      await connectionRef.set(connectionWithOffer);

      // ====================
      //      RECEIVING
      // ====================
      // listening for remote tracks
      peer.pc.addEventListener('track', (event) => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track);
          peer.peerStream.addTrack(track);
        });
      });

      // Listening for remote session description (answer) below
      connectionRef.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!peer.pc.currentRemoteDescription && data.answer) {
          console.log('Set remote description: ', data.answer);
          const answer = new RTCSessionDescription(data.answer);
          await peer.pc.setRemoteDescription(answer);
        }
      });

      // Listen for remote ICE candidates below
      connectionRef
        .collection('calleeCandidates')
        .doc('candidate')
        .onSnapshot((doc) => {
          const candidate = new RTCIceCandidate(doc.data());
          peer.pc.addIceCandidate(candidate);
          // console.log(
          //   `Got new remote ICE candidate: ${JSON.stringify(candidate)}`,
          // );
        });
    },
    async listenNewConnections() {
      const myId = this.getUser.uid;
      const roomRef = roomsCollection.doc(this.roomId);
      roomRef.collection('connections').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data.to === myId) {
              this.initWebRTC(data.from);
              this.peers[data.from].peerStream = new MediaStream();

              console.log(
                'Create PeerConnection with configuration: ',
                configuration,
              );

              const connectionsCollection = roomRef.collection('connections');
              const connectionRef = connectionsCollection.doc(
                `user${data.from}user${myId}`,
              );

              this.registerPeerConnectionListeners(
                this.peers[data.from].pc,
                data.from,
              );

              this.localStream.getTracks().forEach((track) => {
                this.peers[data.from].pc.addTrack(track, this.localStream);
              });

              // listening for remote tracks
              this.peers[data.from].pc.addEventListener('track', (event) => {
                console.log('Got remote track:', event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                  console.log('Add a track to the remoteStream:', track);
                  this.peers[data.from].peerStream.addTrack(track);
                });
              });

              // Code for collecting ICE candidates below
              const calleeCandidatesCollection = connectionRef.collection('calleeCandidates');
              this.peers[data.from].pc.addEventListener(
                'icecandidate',
                (event) => {
                  if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                  }
                  // console.log('Got candidate: ', event.candidate);
                  calleeCandidatesCollection
                    .doc('candidate')
                    .set(event.candidate.toJSON());
                },
              );

              // Code for receiving offer and then creating and sending SDP answer below
              const connectionSnapshot = await connectionRef.get();
              const { offer } = connectionSnapshot.data();
              console.log('Got offer:', offer);
              await this.peers[data.from].pc.setRemoteDescription(
                new RTCSessionDescription(offer),
              );
              const answer = await this.peers[data.from].pc.createAnswer();
              console.log('Created answer:', answer);
              await this.peers[data.from].pc.setLocalDescription(answer);
              const roomWithAnswer = {
                answer: {
                  type: answer.type,
                  sdp: answer.sdp,
                },
              };
              await connectionRef.update(roomWithAnswer);

              // Listening for remote ICE candidates below

              connectionRef
                .collection('callerCandidates')
                .doc('candidate')
                .onSnapshot((doc) => {
                  const data2 = doc.data();
                  if (this.peers[data.from].pc) {
                    this.peers[data.from].pc.addIceCandidate(
                      new RTCIceCandidate(data2),
                    );
                  }
                });
            }
          }
        });
      });
    },
    initWebRTC(id) {
      this.$set(this.peers, id, {
        userId: id,
        pc: new RTCPeerConnection(configuration),
        peerStream: undefined,
        peerVideo: undefined,
      });
      // this.onAddStream(this.peers[id]);
    },
    registerPeerConnectionListeners(peerConnection, id) {
      peerConnection.addEventListener('iceconnectionstatechange ', () => {
        switch (peerConnection.iceConnectionState) {
          case 'closed': // This means connection is shut down and no longer handling requests.
            // hangUpCall();

            break;
          case 'failed':
            // checkStatePermanent('failed');

            break;
          case 'disconnected':
            // checkStatePermanent('disconnected');
            console.log('DISCONNECTED USER:', id);
            // this.openNotification('USER', `user: ${id} left`, 'danger');
            break;
          default:
        }
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
    hangUp() {
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
      this.userLeft();
    },
    async userJoined() {
      const roomRef = roomsCollection.doc(this.roomId);
      await roomRef.collection('activeUsers').doc(this.getUser.uid).set({
        userId: this.getUser.uid,
      });
    },
    async userLeft() {
      const roomRef = roomsCollection.doc(this.roomId);
      roomRef.collection('activeUsers').doc(this.getUser.uid).delete();
      const myConnectionsTo = await roomRef
        .collection('connections')
        .where('to', '==', this.getUser.uid)
        .get();
      const myConnectionsFrom = await roomRef
        .collection('connections')
        .where('from', '==', this.getUser.uid)
        .get();
      const batch1 = db.batch();
      const batch2 = db.batch();

      myConnectionsTo.forEach((doc) => {
        batch1.delete(doc.ref);
      });
      myConnectionsFrom.forEach((doc) => {
        batch2.delete(doc.ref);
      });
      await batch1.commit();
      await batch2.commit();
      // roomRef.collection('deleteConnections').add({ userId: this.getUser.uid });
    },
    listenNewUsers() {
      const myId = this.getUser.uid;
      const roomRef = roomsCollection.doc(this.roomId);
      const unsubscribe = roomRef
        .collection('activeUsers')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const newUser = change.doc.id;
            if (change.type === 'added') {
              if (newUser !== myId) {
                this.initWebRTC(newUser);
                this.peers[newUser].peerStream = new MediaStream();
                this.createOffer(this.peers[newUser], myId, newUser);
                this.openNotification(
                  'USER JOIN',
                  `user: ${change.doc.id}`,
                  'success',
                );
              }
            }
            if (change.type === 'removed') {
              if (newUser !== myId) {
                this.openNotification(
                  'USER',
                  `user: ${change.doc.id} left`,
                  'danger',
                );
                this.peers[newUser].pc.close();
                this.$delete(this.peers, newUser);
              }
              if (newUser === myId) {
                unsubscribe();
              }
            }
          });
        });
    },
    removeUser() {
      console.log('removing user');
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    // this.init();
  },
  // beforeDestroy() {
  //   this.hangUp();
  // },
  created() {
    console.log('created');
    this.init();
    window.addEventListener('beforeunload', this.hangUp);
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.hangUp);
  },
};
</script>

<style lang="scss" scoped>
.party-content {
  overflow: hidden;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
