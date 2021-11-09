<template>
  <div class="main" @contextmenu.prevent>
    <topNav></topNav>
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import topNav from '@/components/nav.vue';

import firebase from 'firebase/app';
import 'firebase/auth';
import { mapGetters, mapActions } from 'vuex';
import { db, rtDb, statusCollection } from '../firebaseConfig';

export default {
  components: {
    topNav,
  },
  methods: {
    ...mapActions(['bindGameRef', 'favGameAction', 'bindUserStatusRef', 'notificationsAction', 'friendAction', 'friendStatusAction']),
    rtdb_presence(uid) {
      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      const userStatusDatabaseRef = rtDb.ref(`/status/${uid}`);

      // We'll create two constants which we will write to
      // the Realtime database when this device is offline
      // or online.
      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      // Create a reference to the special '.info/connected' path in
      // Realtime Database. This path returns `true` when connected
      // and `false` when disconnected.
      rtDb.ref('.info/connected').on('value', (snapshot) => {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() === false) {
          return;
        }

        // If we are currently connected, then use the 'onDisconnect()'
        // method to add a set which will only trigger once this
        // client has disconnected by closing the app,
        // losing internet, or any other means.
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
    },
    statusEmpty(uid) {
      statusCollection.doc(uid).set({ activity: 'still' }, { merge: true });
    },
    rtdb_and_local_fs_presence(uid) {
      const userStatusDatabaseRef = rtDb.ref(`/status/${uid}`);

      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const userStatusFirestoreRef = db.doc(`/status/${uid}`);

      // Firestore uses a different server timestamp value, so we'll
      // create two more constants for Firestore state.
      const isOfflineForFirestore = {
        state: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const isOnlineForFirestore = {
        state: 'online',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      rtDb.ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'
          userStatusFirestoreRef.set(isOfflineForFirestore, { merge: true });
          return;
        }

        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
          userStatusDatabaseRef.set(isOnlineForDatabase);

          // We'll also add Firestore set here for when we come online.
          userStatusFirestoreRef.set(isOnlineForFirestore, { merge: true });
        });
      });
    },
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.rtdb_presence(user.uid);
        this.rtdb_and_local_fs_presence(user.uid);
        this.$store.commit('setUser', user);
        this.$store.dispatch('bindUserProfileRef');
        this.$store.dispatch('bindGameRef');
        this.favGameAction(user.uid);
        this.bindUserStatusRef();
        this.statusEmpty(user.uid);
        this.notificationsAction();
        this.friendAction();

        // if (localStorage.getItem('gameList') === null) {
        //   this.bindGameRef().then(() => {
        //     localStorage.setItem('gameList', JSON.stringify(this.getGames));
        //   });
        // } else {
        //   const games = JSON.parse(localStorage.getItem('gameList'));
        //   this.$store.commit('setGames', games);
        // }
      }
    });
  },
  computed: {
    ...mapGetters(['getGames', 'getPartyInvite']),
  },
  watch: {
    getPartyInvite() {
      // TO DO: this.getPartyInvite
    },
  },
};

</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main-container {
    flex: 1;
}
</style>
