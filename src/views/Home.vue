<template>
  <div class="main">
    <topNav></topNav>
    <div class="main-content">
      <div class="party-types">
        <div class="host-content party-type-host">
          <div class="content-host-button roboto-medium">Host</div>
          <div class="content-container">
            <div class="content-text">
              <h1 class="content-title roboto-medium">Needed Players</h1>
              <h3 class="content-subtitle roboto-medium">
                How big is your party going to be?
              </h3>
            </div>
            <b-slider
              :min="2"
              :max="getGame.maxPlayers"
              ticks
              v-model="players"
              rounded
            ></b-slider>
          </div>
          <div class="content-container">
            <button class="content-create roboto-medium" @click="host">
              create
            </button>
          </div>
        </div>
        <button
          class="party-type-button party-type-join roboto-medium"
          @click="join"
        >
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapActions, mapGetters } from 'vuex';
import topNav from '../components/nav.vue';
import { playersCollection, roomsCollection } from '../firebaseConfig';

export default {
  components: {
    topNav,
  },
  data: () => ({
    voiceLink: '',
    players: 2,
    flag: 0,
  }),
  methods: {
    ...mapActions(['hostGameAction']),
    join() {
      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const playerRef = playersCollection.doc();
      const playerId = playerRef.id;
      playersCollection
        .doc(playerId)
        .set({
          userId: this.getUser.uid,
          game: this.getGame.gameId,
          createdAt: myTimestamp,
          size: this.players,
        })
        .then(() => {
          playersCollection.doc(playerId).onSnapshot((snap) => {
            const { roomId } = snap.data();
            if (roomId !== '') {
              roomsCollection.doc(roomId).onSnapshot((snapShot) => {
                const isfull = snapShot.data().full;
                if (isfull) {
                  this.$store.commit('setRoom', { roomId });
                  if (this.$route.path !== `/crew/${roomId}`) {
                    this.$router.push(`/crew/${roomId}`);
                  }
                }
              });
            }
          });
        });
    },
    init() {
      this.flag = this.getProfile.flags;
      console.log('hello');

      if (this.flag === 0) {
        this.$router.push('/alpha');
      }
    },
    host() {
      this.hostGameAction({
        game: this.getGame.gameId,
        players: [this.getUser.uid],
        size: this.players,
      }).then(() => {
        if (this.$route.path !== `/crew/${this.getRoom}`) {
          this.$router.push(`/crew/${this.getRoom}`);
        }
        // roomsCollection.doc(this.getRoom).onSnapshot((snapShot) => {
        //   const isfull = snapShot.data().full;
        //   if (isfull) {
        //     // this.$router.push(`/crew/${this.getRoom}`);
        //     if (this.$route.path !== `/crew/${this.getRoom}`) {
        //       this.$router.push(`/crew/${this.getRoom}`);
        //     }
        //   }
        // });
      });
    },
  },
  computed: {
    ...mapGetters(['getUser', 'getGame', 'getRoom', 'getProfile']),
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #2b2e43;
}
.main-content {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

//party buttons
.party-types {
  display: flex;
  flex-direction: column;
  // width: 798px;
  padding: 12px;
}
.party-type-button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}
.party-type-host {
  color: white;
  background: #2f3247;
}
.party-type-join {
  color: #00cd69;
  background: #25514d;
}

//host content
.host-content {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 8px;
  max-height: 50px;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
}
.host-content:hover {
  max-height: 500px;
  transition: max-height 0.25s ease-in;
}

.content-host-button {
  width: 100%;
  height: 50px;
  background: #2f3247;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}
.content-input {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 12px;
  padding: 0px 12px;
  background: #2b2e43;
  color: white;
}
.content-create {
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 8px;
  background: #224168;
  font-size: 16px;
  color: #0291f4;
  margin-bottom: 12px;
}
.host-content:hover .content-host-button {
  display: none;
  transition: max-height 0.15s ease-out;
}
.content-container {
  margin-top: 12px;
  padding: 12px 84px;
}
.content-title {
  color: #b7bbd5;
  font-size: 24px;
  padding-bottom: 12px;
}
.content-subtitle {
  color: #626891;
  font-size: 16px;
  padding-bottom: 28px;
}
</style>
