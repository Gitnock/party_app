<template>
  <div class="home-main">
    <div class="home-container">
      <div class="select-game-container game-container" v-if="!curGame" >
        <div class="select-game-content">
          <div
            class="select-game-card clickable"
            v-for="game in getGames"
            v-bind:key="game.gameId"
            v-bind:value="game"
            @click="setGame(game)"
          >
            <img
              :src="game.url_square"
              :placeholder="game.url_tiny"
              :alt="game.gameName"
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div class="join-game-container game-container" ref="target" v-else>
        <div class="join-game-close">
          <vs-avatar circle color="#161823" @click="curGame = null">
            <i class="bx bx-x" style="color: #ffffff"></i>
          </vs-avatar>
        </div>
        <div class="join-game-content">
          <b-image
            class="join-game-img"
            :src="curGame.url"
            :placeholder="curGame.url_tiny"
            :alt="curGame.gameName"
            ratio="446by565"
          />

          <button class="join-game-btn roboto-black" @click="join">Join</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapActions, mapGetters } from 'vuex';
import { db, playersCollection, roomsCollection } from '../firebaseConfig';

export default {
  components: {},
  data: () => ({
    curGame: null,
  }),
  methods: {
    ...mapActions(['hostGameAction']),
    setGame(game) {
      this.$store.commit('setGame', game);
      this.curGame = this.getGame;
    },
    join() {
      const loading = this.$vs.loading({
        target: this.$refs.target,
        type: 'corners',
        background: '#195bff',
        color: '#fff',
        opacity: '1',
        text: 'looking for humans, just a moment',
      });

      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const playerRef = playersCollection.doc();
      const playerId = playerRef.id;
      playersCollection
        .doc(playerId)
        .set({
          userId: this.getUser.uid,
          game: this.getGame.gameId,
          createdAt: myTimestamp,
          size: this.getGame.maxPlayers,
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
                    loading.close();
                    this.setRoom(roomId);
                  }
                }
              }).catch((error) => {
                this.openNotification('failed', error, 'danger');
                loading.close();
              });
            }
          }).catch((error) => {
            this.openNotification('failed', error, 'danger');
            loading.close();
          });
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
    init() {},
    setRoom(roomId) {
      const roomRef = db.doc(`/status/${this.getUser.uid}`);
      roomRef.set({
        roomId,
      }, { merge: true });
    },
    // host() {
    //   this.hostGameAction({
    //     game: this.getGame.gameId,
    //     players: [this.getUser.uid],
    //     size: this.players,
    //   }).then(() => {
    //     if (this.$route.path !== `/crew/${this.getRoom}`) {
    //       this.$router.push(`/crew/${this.getRoom}`);
    //     }
    //     // roomsCollection.doc(this.getRoom).onSnapshot((snapShot) => {
    //     //   const isfull = snapShot.data().full;
    //     //   if (isfull) {
    //     //     // this.$router.push(`/crew/${this.getRoom}`);
    //     //     if (this.$route.path !== `/crew/${this.getRoom}`) {
    //     //       this.$router.push(`/crew/${this.getRoom}`);
    //     //     }
    //     //   }
    //     // });
    //   });
    // },
  },
  computed: {
    ...mapGetters(['getUser', 'getGame', 'getRoom', 'getProfile', 'getGames']),
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.home-main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
    align-items: center;
}
.home-container {
  // height: 100%;
  // max-width: 1320px;
  // display: flex;
  // align-items: center;
  // padding: 12px 32px;
}

//GAME CONTAINER
.game-container {
  height: 628px;
  max-width: 445px;
  padding: 18px;
  display: flex;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
}

// select game
.select-game-container {
  background: #202330;
  //hide scroll
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.select-game-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.select-game-content {
  display: inline-flex;
  // flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 409px;
  // flex: 1;
}
.select-game-card {
  width: 184px;
  height: 203px;
  border-radius: 12px;
  margin: 10px;
  overflow: hidden;
}

// join game
.join-game-container {
  background: #202330;
  position: relative;
}
.join-game-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
}
.join-game-img {
  flex: auto;
  transition: all .3s linear;
}
.join-game-btn {
  width: 409px;
  height: 64px;
  border: none;
  font-size: 18px;
  background-color: #25514d;
  color: #00cd69;
}
.join-game-close {
  // margin: 12px;
  padding: 12px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1000;
}

// MOBILE
@media only screen and (max-width: 510px) {
  .select-game-card {
    width: 144px;
    height: 159px;
    border-radius: 12px;
    margin: 5px;
  }
  .select-game-content{
    width: 308px;
  }
  .container-main {
    padding: 4px;
  }
  .game-container {
    padding: 9px;
    height: 100%;
    max-width: 326px;
    // margin-bottom: 12px;

  }
  .join-game-btn {
    width: 308px;
    height: 64px;
  }
}

@media only screen and (max-height: 842px) {
  .select-game-card {
    width: 144px;
    height: 159px;
    border-radius: 12px;
    margin: 5px;
  }
  .container-main {
    padding: 4px;
  }
  .game-container {
    padding: 9px;
    max-width: 326px;
    margin-bottom: 32px;
    height: 100%;
  }
  .join-game-btn {
    width: 308px;
    height: 64px;
  }
}

</style>
