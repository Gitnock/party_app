<template>
  <div class="invite-item-container">
    <div class="friend-card">
      <div class="friend-img-container">
        <vs-avatar circle class="user-avatar" color="#2b2e43">
          <img
            class="friend-img"
            :src="friend.avatar"
            alt="friend image"
          />
        </vs-avatar>
      </div>
      <div class="friend-card-content">
        <div class="friend-text-content">
          <div>
            <h2 class="gname roboto-m">{{ friend.username }}</h2>
          </div>
        </div>
        <div class="friend-options-container">
          <vs-avatar
            circle
            color="#224168"
            class="call-avatar clickable btn-drop"
            @click="sendInvite()"
          >
            <i class="bx bx-mail-send" style="color: #195bff"></i>
          </vs-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warningMixin } from '@/mixin';
import eventBus from '@/eventBus';

export default {
  name: 'invite-item',
  mixins: [warningMixin],
  data: () => ({
    key: '',
  }),
  props: {
    friend: {},
  },
  methods: {
    sendInvite() {
      eventBus.$emit('close-invite');
    },
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
  // flex-direction: column;
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
@media only screen and (max-width: 700px) {
    .friend-card {
      height: 67px;
    }
    .bx-mail-send {
      font-size: 13px;
    }
}

</style>
