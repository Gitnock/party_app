<template>
  <div class="test-main">
    <div class="test-top">
      <div class="test-content">
        <h2>find game</h2>
        <button @click="join()">look for party</button>
        <h2>RoomId:{{ roomId }}</h2>
        <h2>inParty:{{ inRoom }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { warningMixin } from '@/mixin';
import { mapGetters } from 'vuex';
import { playersCollection } from '../firebaseConfig';

export default {
  mixins: [warningMixin],
  data: () => ({
    inRoom: 0,
    roomId: '',
  }),
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    join() {
      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const playerRef = playersCollection.doc();
      const playerId = playerRef.id;
      playersCollection
        .doc(playerId)
        .set({
          userId: this.getUser.uid,
          game: '6ya2EmsdsmySNgtfaCOC',
          createdAt: myTimestamp,
          size: 2,
        })
        .then(() => {
          const unsubscribe = playersCollection
            .where('__name__', '==', playerId)
            .onSnapshot((snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                  const { roomId } = change.doc.data();
                  this.roomId = roomId;
                  console.log('DATA: ', change.doc.data());
                  this.openNotification(
                    'success',
                    `Party: ${roomId} was Found`,
                    'success',
                  );
                  unsubscribe();
                }
              });
            });
        })
        .catch((error) => {
          this.openNotification('failed', error, 'danger');
          this.closeLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.test-main {
  height: 100%;
}
.test-top {
  height: 400px;
  background-color: cornsilk;
  display: flex;
  justify-content: center;
}
</style>
