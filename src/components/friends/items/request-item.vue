<template>
  <div class="friend-item-container">
    <div class="friend-card">
      <div class="friend-img-container">
        <vs-avatar circle :size="avatarSize" color="#2b2e43">
          <img
            class="friend-img"
            :src="request.avatar"
            alt="friend request image"
          />
        </vs-avatar>
      </div>
      <div class="friend-card-content">
        <div class="friend-text-content">
          <div>
            <h2 class="gname roboto-m">{{ request.username }}</h2>
            <h3 class="uname roboto-m">{{ request.title }}</h3>
          </div>
        </div>
        <div class="friend-options-container">
          <vs-avatar
            success
            circle
            color="#224168"
            :size="btnSize"
            @click="accept(request.from, request.to,request.id)"
          >
            <i class="bx bx-check" style="color: #195bff"></i>
          </vs-avatar>
          <vs-avatar
            success
            circle
            color="#4E2424"
            class="friend-btn-no"
            :size="btnSize"
            @click="deny(request.id)"
          >
            <i class="bx bx-x" style="color: #ff5441"></i>
          </vs-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warningMixen } from '@/mixin';
import firebase from 'firebase/app';
import {
  friendChatCollection,
  friendsCollection,
  notificationsCollection,
} from '../../../firebaseConfig';

export default {
  name: 'friends-request-item',
  mixins: [warningMixen],
  data: () => ({
    key: '',
  }),
  props: {
    request: {},
  },
  methods: {
    accept(from, to, id) {
      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const chatId = friendChatCollection.doc().id;
      friendsCollection
        .doc(to)
        .collection('friends')
        .doc(from)
        .set({ createdAt: myTimestamp, uid: from, chatId })
        .then(() => {
          friendsCollection
            .doc(from)
            .collection('friends')
            .doc(to)
            .set({ createdAt: myTimestamp, uid: to, chatId })
            .then(() => {
              friendChatCollection.doc(chatId).set({
                users: [to, from],
                isActive: true,
                timestamp: myTimestamp,
              });
            })
            .then(() => {
              notificationsCollection.doc(id).update({
                isActive: false,
              });
            });
        });
    },
    deny(id) {
      notificationsCollection.doc(id).update({
        isActive: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.friend-options-delete {
  padding: 0px;
  border: none;
  background-color: transparent;
  height: 24px;
  margin-left: 12px;
}
.friend-options-txt {
  font-size: 24px;
  color: #464a65;
}
.friend-btn-no {
  margin-left: 12px;
}

@media only screen and (max-width: 700px) {
  .friend-card {
    height: 67px;
  }
}
</style>
