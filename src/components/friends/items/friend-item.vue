<template>
  <div class="friend-item-container">
    <div class="friend-card">
      <div class="friend-img-container">
        <vs-avatar
          badge
          :badge-color="friend.state === 'online' ? 'success' : 'danger'"
          circle
          class="user-avatar"
          size="55"
          color="#2b2e43"
        >
          <img :src="friend.avatar" alt="friend-image" />
        </vs-avatar>
      </div>
      <div class="friend-card-content">
        <div class="friend-text-content">
          <div>
            <h2 class="gname roboto-m">{{ friend.username }}</h2>
            <h3 class="uname roboto-m">{{ friend.state }}</h3>
          </div>
        </div>
        <div class="friend-options-container">
          <vs-avatar
            circle
            color="#224168"
            size="44"
            class="clickable call-avatar"
            @click="callFriend(friend.chatId)"
          >
            <i class="bx bxs-phone-call" style="color: #195bff"></i>
          </vs-avatar>
          <button class="friend-options-delete">
            <i class="bx bxs-x-circle"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warningMixin } from '@/mixin';
import eventBus from '@/eventBus';
import { mapGetters } from 'vuex';
import firebase from 'firebase/app';
import { friendChatCollection } from '../../../firebaseConfig';

export default {
  name: 'friends-friend-item',
  mixins: [warningMixin],
  data: () => ({
    key: '',
  }),
  props: {
    friend: {},
  },
  methods: {
    callFriend(chatId) {
      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      friendChatCollection.doc(chatId).update({
        status: `callling-${this.getUser.uid}`,
        timestamp: myTimestamp,
      }).then(() => {
        this.$router.push(`/crew/@me/${chatId}`);
        eventBus.$emit('close');
      }).catch(() => {
        this.openNotification('Failed', `failed to call ${this.friend.username}`, 'danger');
      });
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/friends.scss";
.friend-item-container {
  width: 100%;
}
.friend-card {
  height: 82px;
  width: 100%;
  background-color: $c2_dark;
  margin-bottom: 12px;
  display: flex;
  padding: 13px;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.friend-img-container {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 12px;
}
.friend-text-content {
  display: flex;
  align-items: center;
}
.friend-btn-img {
  width: 18px;
  height: 18px;
}
.close-btn {
  background: #2b2e43;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: fadeIn 1s 1;
}
.friend-card-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.gname {
  max-width: 195px;
  font-size: 16px;
  color: $c5_dark;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.uname {
  font-size: 12px;
  color: #626891;
}
.friend-options-container {
  display: flex;
  align-items: center;
}
.friend-options-delete {
  padding: 0px;
  border: none;
  background-color: transparent;
  height: 24px;
  margin-left: 12px;
}
.bxs-x-circle {
  font-size: 24px;
  color: #464a65;
}
</style>
