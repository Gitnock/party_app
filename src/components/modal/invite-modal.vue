<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container-big">
          <div class="invite-close-container">
              <div></div>
            <button
              class="close-circle btn-div clickable btn-drop"
              @click="$emit('close')"
            >
              <i class="bx bx-x close-icon" style="color: #ffffff"></i>
            </button>
          </div>
          <div class="invite-content">
            <div class="invite-top">
              <h1 class="roboto-m invite-title">Invite friends</h1>
            </div>
            <div class="invite-mid">
              <div class="invite-mid-content">
                <invite
                  :friend="friend"
                  v-for="friend in getFriends"
                  :key="friend.uid"
                />
              </div>
            </div>
            <div class="invite-bot"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
// import eventBus from '@/eventBus';
import invite from './items/invite-item.vue';

export default {
  components: {
    invite,
  },
  computed: {
    ...mapGetters(['getFriends']),
  },
  mounted() {
    // eventBus.$on('close', () => {
    //   this.emit;
    // });
    // this.$on('close', () => {
    //   this.emit('', () => {
    //   });
    // });
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/friends';
.invite-close-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.close-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #2b2e43;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-icon {
  font-size: 24px;
}

//top
.invite-top {
  margin: 0 0 42px 22px;
}
.invite-title {
  font-size: 32px;
  color: white;
}

//mid
.invite-mid {
  display: flex;
  justify-content: center;
}
.invite-mid-content {
  width: 642px;
}

@media screen and (max-width: 705px) {
  .invite-top {
    margin: 0 0 42px 12px;
  }
  .invite-mid-content {
    width: 379px;
  }
  .invite-title {
    font-size: 24px;
  }
}

@media screen and (max-width: 510px) {
  .invite-top {
    margin: 0 0 22px 0;
  }
}
</style>
