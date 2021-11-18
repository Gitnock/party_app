<template>
  <div class="home-main">
    <div class="home-container">
      <div class="select-game-container game-container" v-show="!curGame">
        <div class="select-game-content">
          <button
            class="select-game-card btn-div btn-drop"
            v-for="game in getGames"
            v-bind:key="game.gameId"
            v-bind:value="game"
            @click="setGame(game)"
          >
            <img
              v-show="isAllImgLoad"
              :src="game.url"
              :alt="game.gameName"
              @load="onImgLoad()"
            />
          </button>
        </div>
      </div>
      <div class="join-game-container game-container" v-if="curGame">
        <div class="close-btn-container" v-if="!isLoading">
          <button class="back-btn btn-div btn-drop" @click="removeCurGame()">
            <i class="bx bx-arrow-back" style="color: #ffffff"></i>
          </button>
        </div>

        <div class="close-btn-container" v-if="isLoading">
          <button
            class="close-btn btn-div btn-drop"
            @click="cancelSearch"
            v-if="isBtn"
          >
            <i class="bx bx-x btn-icon"></i>
          </button>
        </div>

        <div class="join-game-content" ref="target">
          <div class="invite-circle-container" v-show="!isLoading">
            <div class="invite-circle-content">
              <button class="user-circle btn-div clickable btn-drop">
                <img class="user-img" :src="getProfile.avatar" alt />
              </button>
              <button
                class="invite-circle btn-div clickable btn-drop"
                v-for="(empty, i) in emptys"
                :key="i"
                @click="isInvite = !isInvite"
              >
                <i class="bx bx-plus" style="color: #0291f4"></i>
              </button>
            </div>
          </div>
          <b-image
            class="join-game-img"
            :src="curGame.url"
            :alt="curGame.gameName"
            ratio="446by565"
          />

          <button
            class="join-game-btn roboto-r"
            @click="hasGame ? join(false) : addUsername()"
            :disabled="isLoading"
          >
            Join
          </button>
        </div>
      </div>
    </div>
    <div>
      <template>
        <confirm v-if="isConfirm" @close="isConfirm = false" :roomId="roomId" />
      </template>
    </div>
    <div>
      <template>
        <username
          v-if="isUsername"
          @close="isUsername = false"
          @exit="setGame(null), (isUsername = false)"
        />
      </template>
    </div>
    <div>
      <template>
        <invite v-if="isInvite" @close="isInvite = false" />
      </template>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapActions, mapGetters } from 'vuex';
import confirm from '@/components/modal/confirm-modal.vue';
import username from '@/components/modal/username-modal.vue';
import invite from '@/components/modal/invite-modal.vue';
import eventBus from '@/eventBus';
import { userStatusMixin } from '@/mixin';
import {
  partysCollection,
  // notificationsCollection,
  playersCollection,
  roomsCollection,
  statusCollection,
} from '../firebaseConfig';

export default {
  components: {
    confirm,
    username,
    invite,
  },
  mixins: [userStatusMixin],
  data: () => ({
    isBtn: false,
    isConfirm: false,
    isUsername: false,
    isInvite: false,
    curGame: null,
    isLoading: false,
    loading: null,
    searching: null,
    roomListener: null,
    roomId: '',
    sound: null,
    imgLCount: 0,
  }),
  methods: {
    ...mapActions([
      'hostGameAction',
      'setRoomIdAction',
      'bindRoomDataRef',
      'unbindRoomDataRef',
    ]),
    setGame(game) {
      this.$store.commit('setGame', game);
      this.curGame = this.getGame;
      if (!this.hasGame) {
        this.addUsername();
      }
    },
    join(isSearch) {
      if (this.getUserStatus.activity !== 'looking' || isSearch) {
        this.statusLooking();
        this.disTpRoom();
        this.loading = this.$vs.loading({
          target: this.$refs.target,
          type: 'corners',
          background: '#195bff',
          color: '#fff',
          opacity: '1',
          text: 'looking for partys',
        });

        // hide close match button for 3 sec
        this.isBtn = false;
        setTimeout(() => {
          this.isBtn = true;
        }, 2000);

        this.isLoading = true;

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
            this.searching = playersCollection
              .doc(playerId)
              .onSnapshot((snap) => {
                const { roomId } = snap.data();
                if (roomId) {
                  this.roomId = roomId;
                  this.setTempRoom(roomId);
                  this.roomListener = roomsCollection.doc(roomId).onSnapshot(
                    async (snap2) => {
                      if (snap2.exists) {
                        const { full, isActive } = snap2.data();
                        if (full && this.isLoading && isActive === true) {
                          await this.setRoomIdAction(roomId);
                          this.unbindRoomDataRef();
                          this.bindRoomDataRef();
                          this.isConfirm = !this.isConfirm;
                          this.closeLoading();
                        } else if (this.isLoading && isActive !== true) {
                          // console.log('LEFT ROOM', isActive);
                          await this.statusEmpty();
                          this.closeLoading();
                          this.join();
                        }
                      }
                    },
                    (error) => {
                      this.openNotification(
                        'Join room failed',
                        error,
                        'danger',
                      );
                      this.closeLoading();
                    },
                  );
                }
              });
          })
          .catch((error) => {
            this.openNotification('failed', error, 'danger');
            this.closeLoading();
          });
      } else {
        this.openNotification(
          'Failed',
          'another instance is already looking for a game',
          'danger',
        );
      }
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
    disRoom() {
      if (this.roomId) {
        roomsCollection.doc(this.roomId).update({ isActive: false });
      }
    },
    disParty() {
      if (this.partyId) {
        partysCollection
          .doc(this.partyId)
          .update({
            players: firebase.firestore.FieldValue.arrayRemove(
              this.getUser.uid,
            ),
          });
      }
      this.updateParty('');
    },
    statusLooking() {
      this.updateStatus('looking');
    },
    statusFound() {
      this.updateStatus('found');
    },
    async statusEmpty() {
      await this.updateStatus('still');
    },
    async updateStatus(activity) {
      await statusCollection
        .doc(this.getUser.uid)
        .set({ activity }, { merge: true });
    },
    cancelSearch() {
      this.statusEmpty();
      this.disRoom();
      this.closeLoading();
    },
    closeLoading() {
      if (this.loading !== null) {
        this.loading.close();
      }
      this.isLoading = false;
      if (this.searching !== null) {
        this.searching();
        this.searching = null;
      }
      if (this.roomListener !== null) {
        this.roomListener();
        this.roomListener = null;
      }
    },
    addUsername() {
      this.isUsername = true;
    },
    setTempRoom(tempRoomId) {
      statusCollection
        .doc(this.getUser.uid)
        .set({ tempRoomId }, { merge: true });
    },
    disTpRoom() {
      roomsCollection
        .doc(this.getUserStatus.tempRoomId)
        .update({ isActive: false });
    },
    loadImage(objs) {
      const imgs = objs.map((obj) => obj.url);
      imgs.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    },
    onImgLoad() {
      this.imgLCount += 1;
    },
    removeCurGame() {
      this.curGame = null;
      this.disParty();
      this.statusEmpty();
    },
  },
  computed: {
    activity() {
      return this.getUserStatus.activity;
    },
    partyId() {
      return this.getUserStatus.partyId;
    },
    hasGame() {
      let out = false;
      if (typeof this.getFavGames !== 'undefined' && this.curGame) {
        out = this.getFavGames
          ? this.getFavGames.some((id) => id.gameId === this.curGame.gameId)
          : false;
      }
      return out;
    },
    isAllImgLoad() {
      return this.getGames.length === this.imgLCount;
    },
    emptys() {
      let out = [];
      if (this.curGame) {
        out = Array(this.curGame.maxPlayers - 1).fill('invite');
      }
      return out;
    },
    ...mapGetters([
      'getUser',
      'getGame',
      'getRoomId',
      'getProfile',
      'getGames',
      'getFavGames',
      'getRoomData',
      'getUserStatus',
    ]),
  },
  watch: {
    activity(oldv, newV) {
      if (newV === 'still' && oldv !== 'still') {
        this.disTpRoom();
      }
    },
    partyId(oldv, newV) {
      if (newV === 'still' && oldv !== 'still') {
        this.disParty();
      }
    },
  },
  mounted() {
    eventBus.$on('search', () => {
      this.join(true);
    });
    eventBus.$on('disRoom', () => {});
    eventBus.$on('close-invite', () => {
      this.isInvite = false;
    });
    // this.loadImage(this.getGames);
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

//GAME CONTAINER
.game-container {
  height: 628px;
  max-width: 445px;
  padding: 8px;
  display: flex;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
}

// select game
.select-game-container {
  background: $c2_dark;
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
  background: $c2_dark;
  position: relative;
  padding: 0px !important;
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
  -webkit-filter: blur(8px);
  filter: blur(8px);
}
.join-game-btn {
  width: 409px;
  height: 64px;
  border: none;
  font-size: 18px;
  background-color: #25514d;
  color: #00cd69;
}
.close-btn-container {
  // margin: 12px;
  padding: 12px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1000;
}

.close-btn {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: fadeIn 1s 1;
}
.back-btn {
  background: $c2_dark;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

//invite
.invite-circle-container {
  padding: 62px;
  width: 100%;
  height: 90%;
  position: absolute;
  // background: #00cd69;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
}
.invite-circle-content {
  width: 232px;
  display: flex;
  flex-wrap: wrap;
}
.invite-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #224168;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.user-img {
  width: 100%;
  object-fit: cover;
}
// MOBILE
@media only screen and (max-width: 510px) {
  .select-game-card {
    width: 144px;
    height: 159px;
    border-radius: 12px;
    margin: 5px;
  }
  .select-game-content {
    width: 308px;
    height: 338px;
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
  .select-game-content {
    width: 308px;
    height: 338px;
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

  //invite-mobile
  .invite-circle-content {
    width: 232px;
    display: flex;
    flex-wrap: wrap;
  }
  .invite-circle {
    width: 70px;
    height: 70px;
  }
  .user-circle {
    width: 70px;
    height: 70px;
  }
}
</style>
