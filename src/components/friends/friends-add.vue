<template>
  <div class="friends-add-main">
    <div class="content-main">
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-m">Add friend</h1>
          <h3 class="content-subtitle roboto-m">
            Be careful, usernames are CaSe sEnSiTiVe
          </h3>
        </div>
        <input
          type="text"
          class="content-input"
          v-model="uname"
          placeholder="Username#0000"
        />
      </div>
      <div class="content-container" v-if="isGood">
        <button class="content-save roboto-m" @click="sendFriendRequest">Send Request</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { warningMixin } from '@/mixin';
import firebase from 'firebase/app';
import { notificationsCollection, usersCollection } from '../../firebaseConfig';

export default {
  name: 'friends-friends-page',
  mixins: [warningMixin],
  data: () => ({
    uname: '',
  }),
  methods: {
    sendFriendRequest() {
      const user = this.getUserName(this.uname);

      const tag = Number(this.getUserTag(this.uname));

      if (
        tag.toString().length === 4
        && user !== this.getProfile.username
        && tag !== this.getProfile.tag
      ) {
        const query = usersCollection
          .where('username', '==', user)
          .where('tag', '==', tag);
        query.get().then((snap) => {
          const docs = snap.docs.map((doc) => doc.data());
          if (docs[0]) {
            this.openNotification('Found User', docs[0].username, 'success');
            const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
            this.isAddFriend = !this.isAddFriend;
            const docId = notificationsCollection
              .doc().id;

            notificationsCollection
              .doc(docId)
              .set({
                createdAt: myTimestamp,
                from: this.getUser.uid,
                to: docs[0].userId,
                title: 'Wants to be your friend',
                title2: 'Cancel friend request',
                message: '',
                type: 1,
                id: docId,
                isActive: true,
              }).catch((e) => {
                this.openNotification('Error', `${e}`, 'warning');
              });
          } else {
            this.openNotification('Error', "User doesn't Exist", 'danger');
          }
        });
      } else {
        this.openNotification(
          'Error',
          'Remeber username is username#tag = username#0000',
          'danger',
        );
      }
    },
    getUserName(str) {
      return str.split('#')[0].trim();
    },
    getUserTag(str) {
      return str.split('#')[1];
    },
  },
  computed: {
    isGood() {
      if (this.uname.length > 1) {
        return true;
      }
      return false;
    },
    ...mapGetters([
      'getProfile',
      'getUser',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';
</style>
