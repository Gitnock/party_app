<template>
  <div class="main">
    <div class="party-content">
      <div class="columns is-multiline">
        <div class="column">
          <button @click="callOther">call</button>
        </div>
        <div class="column">
          <button @click="answerCall">answer</button>
        </div>
        <div class="column">
          <audio controls ref="audio" />
        </div>
        <div class="column">
          <audio controls ref="remoteAudio" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConfig';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;
export default {
  data: () => ({
    callId: '123456789',
  }),
  methods: {
    async init() {
      // get user mic permissions and mic stream
      localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      remoteStream = new MediaStream();

      // Push tracks from local stream to peer connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // Pull tracks from remote stream, add to video stream
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      // Show stream in HTML mic
      this.$refs.audio.srcObject = localStream;
      // Show remote stream in HTML mic
      this.$refs.remoteAudio.srcObject = remoteStream;
    },
    // CREAT AN OFFER OR CALL
    async callOther() {
      // reference Firestore collection for signaling
      const callDoc = db
        .collection('calls')
        .doc(this.callId ? this.callId : '123456789');
      const offerCandidates = callDoc.collection('offerCandidates');
      const answerCandidates = callDoc.collection('answerCandidates');

      // Get candidates for caller, save to db
      pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          offerCandidates.add(json);
        }
      });

      // create offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      // Listen for remote answer
      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      // When answered, add candidate to peer connection
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    },
    // ANSWER CALL WITH UNIQUE ID
    async answerCall() {
      const callDoc = db.collection('calls').doc(this.callId);
      const answerCandidates = callDoc.collection('answerCandidates');
      const offerCandidates = callDoc.collection('offerCandidates');

      pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          answerCandidates.add(json);
        }
      });
      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription),
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === 'added') {
            const data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    },

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
