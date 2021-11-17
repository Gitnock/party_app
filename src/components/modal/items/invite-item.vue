<template>
  <div class="invite-item-container">
    <div class="friend-card">
      <div class="friend-img-container">
        <vs-avatar circle class="user-avatar" color="#2b2e43">
          <img class="friend-img" :src="friend.avatar" alt="friend image" />
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
import { warningMixin, userStatusMixin } from '@/mixin';
import eventBus from '@/eventBus';
import firebase from 'firebase/app';
import { mapGetters } from 'vuex';
import { notificationsCollection, partysCollection } from '../../../firebaseConfig';

export default {
  name: 'invite-item',
  mixins: [warningMixin, userStatusMixin],
  data: () => ({
    key: '',
  }),
  props: {
    friend: {},
  },
  methods: {
    sendInvite() {
      const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const docId = notificationsCollection
        .doc().id;

      if (this.getUserStatus.partyId && this.getUserStatus.partyId !== '') {
        // if user is in a party
        this.openNotification('success', 'user is in a party', 'success');
        notificationsCollection
          .doc(docId)
          .set({
            createdAt: myTimestamp,
            from: this.getUser.uid,
            to: this.friend.uid,
            title: 'wants you to join them',
            gameId: this.getGame.gameId,
            partyId: this.getUserStatus.partyId,
            type: 0,
            id: docId,
            isActive: true,
          }).then(
            () => {
              // eventBus.$emit('notification-sent');
            },
          ).catch((e) => {
            this.openNotification('Error', `${e}`, 'danger');
          });
      } else {
        // if user is not in a party
        this.openNotification('Error', 'user is not in a party', 'warning');
        const partyId = partysCollection.doc().id;
        partysCollection
          .doc(partyId)
          .set({
            full: false,
            gameId: this.getGame.gameId,
            isActive: true,
            players: [this.getUser.uid],
            size: this.getGame.maxPlayers,
            createdAt: myTimestamp,
          }).then(
            async () => {
              await this.updateParty(partyId);
              notificationsCollection
                .doc(docId)
                .set({
                  createdAt: myTimestamp,
                  from: this.getUser.uid,
                  to: this.friend.uid,
                  title: 'has wants you to join them',
                  gameId: this.getGame.gameId,
                  partyId: this.getUserStatus.partyId,
                  type: 0,
                  id: docId,
                  isActive: true,
                }).then(
                  () => {
                    // eventBus.$emit('notification-sent');
                  },
                ).catch((e) => {
                  this.openNotification('Error', `${e}`, 'danger');
                });
            },
          ).catch((e) => {
            this.openNotification('Error', `${e}`, 'danger');
          });
      }

      eventBus.$emit('close-invite');
    },
  },
  computed: {
    ...mapGetters(['getGame', 'getUser', 'getUserStatus']),
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
