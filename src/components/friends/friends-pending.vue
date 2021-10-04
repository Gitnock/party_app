<template>
 <div class="friends-pending-main">
    <div class="content-main" v-show="getFavGamesSettings.length > 0">
      <transition-group name="list" tag="div">
        <friendRequest  :request="request" v-for="request in getFriendRequests"
          :key="request.id"/>
      </transition-group>
    </div>
    <div class="content-main" v-show="getFavGamesSettings.length === 0">
      <div class="content-google" >
        <div class="con-google-main">
          <div>
            You have no games with a username.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { warningMixen } from '@/mixin';
import { usersCollection } from '../../firebaseConfig';
import friendRequest from './items/request-item.vue';

export default {
  name: 'friends-friends-page',
  mixins: [warningMixen],
  data() {
    return {};
  },
  components: {
    friendRequest,
  },
  methods: {
    ...mapActions(['favGameAction']),
    deleteGame(gameId) {
      usersCollection.doc(this.getUser.uid).collection('favGames').doc(gameId).delete()
        .then(() => {
          this.openNotification('Success', 'Username was erased', 'success');
          this.favGameAction(this.getUser.uid);
        })
        .catch((e) => {
          this.openNotification('Failed', `Username failed to be erased: ${e}`, 'danger');
        });
    },
  },
  computed: {
    ...mapGetters(['getFavGamesSettings', 'getFriendRequests', 'getUser', 'getFriendStates']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';

</style>
