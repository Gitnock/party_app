<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <div class="bar-container">
              <div
                class="bar"
                ref="sumbitBar"
                :style="{ width: timeleft + '%' }"
              ></div>
            </div>
          </div>

          <div class="modal-body">
            <h1 class="modal-title roboto-m">MATCH FOUND</h1>
            <div class="dots-container" v-if="getRoomData">
              <div v-for="(dot, i) in getRoomData.isConfirmed" :key="i">
                <div class="dot dot-green" v-if="dot[0] === '1'" />
                <div class="dot dot-red" v-else />
              </div>
              <div v-for="(dot, i) in empDot" :key="'a' + i">
                <div class="dot dot-emp" />
              </div>
            </div>
          </div>

          <div class="modal-footer" v-if="canSub">
            <button
              class="modal-accept-button modal-button roboto-m btn-drop"
              ref="accept-btn"
              @click="accept"
            >
              Accept
            </button>
            <button
              class="modal-leave-button modal-button roboto-m btn-drop"
              @click="$emit('close')"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase/app';
import eventBus from '@/eventBus';
import * as workerTimers from 'worker-timers';
import { Howl } from 'howler';
import { userStatusMixin } from '@/mixin';
import { db, roomsCollection, rtDb } from '../../firebaseConfig';
import matchFoundFx from '../../assets/sounds/matchfound-start.mp3';
import FoundtickFx from '../../assets/sounds/matchfound-tick.mp3';

export default {
  mixins: [userStatusMixin],
  data: () => ({
    showModal: false,
    timeleft: 100,
    canSub: true,
    isAccepted: false,
    submitTimer: null,
    serverTimeOffset: 0,
    playFound: null,
    playTick: null,
  }),
  props: {
    roomId: {
      type: String,
      default: '',
    },
  },
  methods: {
    countDown() {
      rtDb.ref('.info/serverTimeOffset').on('value', (snapshot) => {
        this.Offset = snapshot.val();
      });
      const roomCreatedAt = Date.now();
      this.submitTimer = workerTimers.setInterval(() => {
        const timeLeft = 20 * 1000 - (Date.now() - roomCreatedAt - this.Offset);
        if (timeLeft < 5) {
          if (this.isAccepted) {
            eventBus.$emit('search');
          }
          this.$emit('close');
        } else {
          if (this.isAllSub) {
            if (this.isGood) {
              this.setRoom(this.roomId, this.getRoomData.game);
              this.joinRoom();
            } else if (this.isAccepted) {
              eventBus.$emit('search');
            }
            this.$emit('close');
          }
          const t = ((timeLeft / 1000) * 10.0) / 2.0;
          this.timeleft = t;
        }
      }, 100);
    },
    accept() {
      if (this.timeleft > 10 && this.canSub) {
        this.isAccepted = true;
        this.canSub = false;
        const roomRef = roomsCollection.doc(this.roomId);

        db.runTransaction((transaction) => transaction.get(roomRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            // throw 'Document does not exist!';
          }

          const { isActive, isConfirmed } = sfDoc.data();
          if (isActive) {
            const newItem = `${1}-${this.getUser.uid}`;

            transaction.update(roomRef, {
              isConfirmed: firebase.firestore.FieldValue.arrayUnion(
                newItem,
              ),
            });
            const newConfirmed = isConfirmed.concat(newItem);
            return newConfirmed;
          }

          return Promise.reject(new Error('something bad happened'));
        }))
          .then((temp) => {
            console.log('trans worked: ', temp);
          })
          .catch((err) => {
            console.error(`trans failed: ${err}`);
          });

        // roomsCollection.doc(this.roomId).update({
        //   isConfirmed: firebase.firestore.FieldValue.arrayUnion(
        //     `${1}-${this.getUser.uid}`,
        //   ),
        // });
      }
    },
    decline() {
      if (this.timeleft > 0 && this.canSub) {
        this.canSub = false;
        roomsCollection.doc(this.roomId).update({
          isConfirmed: firebase.firestore.FieldValue.arrayUnion(
            `${0}-${this.getUser.uid}`,
          ),
        });
      }
    },
    joinRoom() {
      if (this.$route.path !== `/crew/${this.roomId}`) {
        this.$router.push(`/crew/${this.roomId}`);
      }
    },
    setRoom(roomId, gameId) {
      const roomRef = db.doc(`/status/${this.getUser.uid}`);
      roomRef.set(
        {
          roomId,
          gameId,
        },
        { merge: true },
      );
    },
    statusEmpty() {
      this.updateStatus('still');
    },
    playMusic() {
      this.playFound = new Howl({
        src: [matchFoundFx],
        volume: 0.4,
      });
      this.playTick = new Howl({
        src: [FoundtickFx],
        volume: 0.2,
        loop: true,
        rate: 1.7,
      });

      this.playFound.play();
      this.playTick.play();
    },
  },
  mounted() {
    this.playMusic();
    this.countDown();
    this.$on('close', () => {
      if (this.submitTimer != null) {
        workerTimers.clearInterval(this.submitTimer);
        this.submitTimer = null;
      }
      this.decline();
      this.statusEmpty();
      const { playing } = this.playTick;
      if (playing) {
        this.playTick.stop();
      }
    });
  },
  beforeDestroy() {
    this.$emit('close');
  },
  computed: {
    isOnTime() {
      if (this.getRoomData.isConfirmed) {
        return this.getRoomData.isActive;
      }
      return false;
    },
    isGood() {
      if (this.getRoomData.isConfirmed) {
        return this.getRoomData.isConfirmed.every((i) => i[0] === '1');
      }
      return false;
    },
    isAllSub() {
      if (this.getRoomData.isConfirmed) {
        return (
          this.getRoomData.size === this.getRoomData.isConfirmed.length
          && this.isOnTime
        );
      }
      return false;
    },
    empDot() {
      if (this.getRoomData.isConfirmed) {
        return this.getRoomData.size - this.getRoomData.isConfirmed.length;
      }
      return 0;
    },
    ...mapGetters(['getRoomData', 'getRoomId', 'getUser']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/modal.scss';

.modal-title {
  color: $c5_dark;
  font-size: 24px;
  padding: 12px 18px;
}

//bar
.bar-container {
  width: 100%;
  height: 8px;
  border-radius: 8px;
  background-color: $c2_dark;
  overflow: hidden;
}
.bar {
  width: 10%;
  height: 100%;
  background-color: #464a65;
}
//confirm dots
.dots-container {
  display: flex;
}
.dot {
  height: 30px;
  width: 30px;
  background-color: $c2_dark;
  border-radius: 50%;
  display: inline-block;
  margin: 0px 4px;
}
.dot-green {
  background-color: #00cd69;
}
.dot-red {
  background-color: #ff5441;
}
.dot-emp {
  background-color: $c2_dark;
}
</style>
