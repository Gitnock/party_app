<template>
  <div class="main">
    <div class="party-content">
      <div class="columns is-multiline">
        <div class="column">
          <button>call</button>
        </div>
        <div class="column">
          <button>answer</button>
        </div>
        <div class="column">
          <audio controls ref="localAudio" muted />
        </div>
      </div>
      <div>
        <div v-for="peer in peers" :key="peer.userId">
          dfdf
          <audio ref="localAudio" :src="peer.peerStream" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { roomsCollection } from '../firebaseConfig';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};
// const pc = new RTCPeerConnection(configuration);
let localStream = null;
export default {
  data: () => ({
    roomId: '',
    peers: {},
  }),
  methods: {
    init() {
      this.roomId = this.$route.params.roomId;
      roomsCollection
        .doc(this.roomId)
        .get()
        .then((snap) => {
          if (snap.exists) {
            this.registerNewConnections();
          } else {
            this.$router.push('/');
            this.openNotification(
              'Error',
              `Party doesn't Exist${this.roomId}`,
              'danger',
            );
          }
        });
      this.getUserMedia();
    },
    async getUserMedia() {
      let stream;
      try {
        // get user mic permissions and mic stream
        stream = await navigator.mediaDevices.getUserMedia({
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

      // Push tracks from local stream to peer connection
      // localStream.getTracks().forEach((track) => {
      //   pc.addTrack(track, localStream);
      // });

      // Show stream in HTML mic
      this.$refs.localAudio.srcObject = stream;
      // mute local audio
      this.$refs.localAudio.volume = 0;
      localStream = stream;
    },
    // CREAT AN OFFER OR CALL
    // async callOther() {
    //   // reference Firestore collection for signaling
    //   const callDoc = db
    //     .collection('calls')
    //     .doc(this.callId ? this.callId : '123456789');
    //   const offerCandidates = callDoc.collection('offerCandidates');
    //   const answerCandidates = callDoc.collection('answerCandidates');

    //   // Get candidates for caller, save to db
    //   pc.addEventListener('icecandidate', (event) => {
    //     if (event.candidate) {
    //       const json = event.candidate.toJSON();
    //       offerCandidates.add(json);
    //     }
    //   });

    //   // create offer
    //   const offerDescription = await pc.createOffer();
    //   await pc.setLocalDescription(offerDescription);

    //   const offer = {
    //     sdp: offerDescription.sdp,
    //     type: offerDescription.type,
    //   };

    //   await callDoc.set({ offer });

    //   // Listen for remote answer
    //   callDoc.onSnapshot((snapshot) => {
    //     const data = snapshot.data();
    //     if (!pc.currentRemoteDescription && data?.answer) {
    //       const answerDescription = new RTCSessionDescription(data.answer);
    //       pc.setRemoteDescription(answerDescription);
    //     }
    //   });

    //   // When answered, add candidate to peer connection
    //   answerCandidates.onSnapshot((snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //       if (change.type === 'added') {
    //         const candidate = new RTCIceCandidate(change.doc.data());
    //         pc.addIceCandidate(candidate);
    //       }
    //     });
    //   });
    // },
    // ANSWER CALL WITH UNIQUE ID
    // async answerCall() {
    //   const callDoc = db.collection('calls').doc(this.callId);
    //   const answerCandidates = callDoc.collection('answerCandidates');
    //   const offerCandidates = callDoc.collection('offerCandidates');

    //   pc.addEventListener('icecandidate', (event) => {
    //     if (event.candidate) {
    //       const json = event.candidate.toJSON();
    //       answerCandidates.add(json);
    //     }
    //   });
    //   const callData = (await callDoc.get()).data();

    //   const offerDescription = callData.offer;
    //   await pc.setRemoteDescription(
    //     new RTCSessionDescription(offerDescription),
    //   );

    //   const answerDescription = await pc.createAnswer();
    //   await pc.setLocalDescription(answerDescription);

    //   const answer = {
    //     type: answerDescription.type,
    //     sdp: answerDescription.sdp,
    //   };

    //   await callDoc.update({ answer });

    //   offerCandidates.onSnapshot((snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //       console.log(change);
    //       if (change.type === 'added') {
    //         const data = change.doc.data();
    //         pc.addIceCandidate(new RTCIceCandidate(data));
    //       }
    //     });
    //   });
    // },
    registerNewConnections() {
      roomsCollection
        .doc(this.roomId)
        .get()
        .then((snap) => {
          const roomData = snap.data();
          const inRoom = roomData.players;
          inRoom.forEach((userId) => {
            if (userId !== this.getUser.uid) {
              this.initWebRTC(userId);
              const remoteStream = new MediaStream();
              this.peers[userId].peerStream = remoteStream;
              this.createOffer(
                this.peers[userId],
                this.getUser.uid,
                userId,
              );
            }
          });
        });
    },
    async createOffer(peer, from, to) {
      const connectionsCollection = roomsCollection
        .doc(this.roomId)
        .collection('connections');

      const connectionRef = connectionsCollection.doc(`user${from}user${to}`);
      // setting local track in connection
      localStream.getTracks().forEach((track) => {
        peer.pc.addTrack(track, localStream);
      });

      // Get candidates for caller, save to db
      const callerCandidatesCollection = connectionRef.collection(
        'callerCandidates',
      );
      peer.pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          callerCandidatesCollection.add(json);
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
      await connectionRef.set(connectionWithOffer).then(() => {
        console.log('Created offer:', offer);
      });

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
        if (!peer.pc.currentRemoteDescription && data && data.answer) {
          console.log('Got remote description: ', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await peer.pc.setRemoteDescription(rtcSessionDescription);
        }
      });

      // Listen for remote ICE candidates below
      connectionRef.collection('calleeCandidates').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`,
            );
            await peer.pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });

      // connectedUsers[activeUser.userId].peerConnection = peerConnection;
    },
    // async createAnswer(peer, from, to) {
    //   const connectionsCollection = roomsCollection
    //     .doc(this.roomId)
    //     .collection('connections');

    //   const connectionRef = connectionsCollection.doc(
    //     `user${from}user${to}`,
    //   );

    // },
    // onAddStream(peer) {},
    async listenNewConnections() {
      const myId = this.getUser.uid;
      const roomRef = roomsCollection.doc(this.roomId);
      roomRef.collection('connections').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data.to === myId) {
              this.initWebRTC(data.from);
              const remoteStream = new MediaStream();
              this.peers[data.from].peerStream = remoteStream;

              console.log(
                'Create PeerConnection with configuration: ',
                configuration,
              );
              const peerConnection = new RTCPeerConnection(configuration);

              const connectionsCollection = roomRef.collection('connections');
              const connectionRef = connectionsCollection.doc(
                `user${data.from}user${myId}`,
              );

              // registerPeerConnectionListeners(peerConnection, data.from);

              localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
              });

              // listening for remote tracks
              peerConnection.addEventListener('track', (event) => {
                console.log('Got remote track:', event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                  console.log('Add a track to the remoteStream:', track);
                  this.peers[data.from].peerStream.addTrack(track);
                });
              });

              // Code for collecting ICE candidates below
              const calleeCandidatesCollection = connectionRef.collection(
                'calleeCandidates',
              );
              peerConnection.addEventListener('icecandidate', (event) => {
                if (!event.candidate) {
                  console.log('Got final candidate!');
                  return;
                }
                console.log('Got candidate: ', event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
              });

              // Code for receiving offer and then creating and sending SDP answer below
              const connectionSnapshot = await connectionRef.get();
              const { offer } = connectionSnapshot.data();
              console.log('Got offer:', offer);
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer),
              );
              const answer = await peerConnection.createAnswer();
              console.log('Created answer:', answer);
              await peerConnection.setLocalDescription(answer);
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
                .onSnapshot((snap) => {
                  snap.docChanges().forEach(async (change2) => {
                    if (change2.type === 'added') {
                      const data2 = change.doc.data();
                      console.log(
                        `Got new remote ICE candidate: ${JSON.stringify(data2)}`,
                      );
                      await this.peers[data.from].addIceCandidate(
                        new RTCIceCandidate(data2),
                      );
                    }
                  });
                });

              // connectedUsers[data.from].peerConnection = peerConnection;
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
    openNotification(title, text, color) {
      this.$vs.notification({
        // flat: true,
        title,
        text,
        position: 'bottom-center',
        color,
      });
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.party-content {
  overflow: hidden;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
