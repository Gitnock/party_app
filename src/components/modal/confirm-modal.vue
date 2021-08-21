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
            <h1 class="modal-title roboto-medium">MATCH FOUND</h1>
            <div class="dots-container" v-if="getRoomData">
              <div v-for="(dot, i) in getRoomData.isConfirmed" :key="i">
                <div class="dot dot-green" v-if="dot[0] === '1'" />
                <div class="dot dot-red" v-else />
              </div>
            </div>
          </div>

          <div class="modal-footer" v-if="canSub">
            <button
              class="modal-accept-button modal-button roboto-medium btn-drop"
              ref="accept-btn"
              @click="accept"
            >
              Accept
            </button>
            <button
              class="modal-leave-button modal-button roboto-medium btn-drop"
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
import { roomsCollection, rtDb } from '../../firebaseConfig';

export default {
  components: {},
  data: () => ({
    showModal: false,
    timeleft: 100,
    canSub: true,
    isAccepted: false,
    submitTimer: undefined,
    serverTimeOffset: 0,
  }),
  props: {
    roomId: {
      type: String,
      default: '',
    },
  },
  methods: {
    countDown() {
      rtDb.ref('.info/serverTimeOffset').on('value', (snapshot) => { this.serverTimeOffset = snapshot.val(); });
      const roomCreatedAt = Date.now();
      this.submitTimer = setInterval(() => {
        const timeLeft = (20 * 1000) - (Date.now() - roomCreatedAt - this.serverTimeOffset);
        if (timeLeft < 0) {
          this.canSub = false;
          if (this.isAccepted) {
            eventBus.$emit('search');
          }
          this.$emit('close');
        } else {
          if (this.isAllSub) {
            console.log('ALL SUBBED', this.isGood, this.isAccepted);
            if (this.isGood) {
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
      if (this.timeleft > 0 && this.canSub) {
        this.isAccepted = true;
        this.canSub = false;
        roomsCollection.doc(this.roomId).update({
          isConfirmed: firebase.firestore.FieldValue.arrayUnion(`${1}-${this.getUser.uid}`),
        });
      }
    },
    decline() {
      if (this.timeleft > 0 && this.canSub) {
        this.canSub = false;
        roomsCollection.doc(this.roomId).update({
          isConfirmed: firebase.firestore.FieldValue.arrayUnion(`${0}-${this.getUser.uid}`),
        });
      }
    },
    joinRoom() {
      if (this.$route.path !== `/crew/${this.roomId}`) {
        this.$router.push(`/crew/${this.roomId}`);
      }
    },
  },
  mounted() {
    this.countDown();
    this.$on('close', () => {
      clearInterval(this.submitTimer);
      this.decline();
    });
  },
  beforeDestroy() {
    this.$emit('close');
  },
  computed: {
    isGood() {
      if (this.getRoomData) return this.getRoomData.isConfirmed.every((i) => i[0] === '1');
      return false;
    },
    isAllSub() {
      if (this.getRoomData) return this.getRoomData.size === this.getRoomData.isConfirmed.length;
      return false;
    },
    ...mapGetters(['getRoomData', 'getRoomId', 'getUser']),
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 373px;
  margin: 0px auto;
  padding: 24px;
  background-color: #161823;
  border-radius: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
}

.modal-button {
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 18px;
}
.modal-leave-button {
  width: 106px;
  background-color: #202330;
}
.modal-accept-button {
  width: 202px;
  background-color: #195bff;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-title {
  color: #b7bbd5;
  font-size: 24px;
  padding: 12px 18px;
}

//bar
.bar-container {
  width: 100%;
  height: 8px;
  border-radius: 8px;
  background-color: #202330;
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
  background-color: #202330;
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
</style>
