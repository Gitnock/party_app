<template>
  <div class="friends-friends-main">
    <div class="content-main" v-show="getFavGamesSettings.length > 0">
      <transition-group name="list" tag="div">
        <friend  :friend="friend" v-for="friend in getFriendsStatus"
          :key="friend.uid"/>
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
import { warningMixin } from '@/mixin';
import friend from './items/friend-item.vue';

export default {
  name: 'friends-friends-page',
  mixins: [warningMixin],
  data() {
    return {};
  },
  components: {
    friend,
  },
  methods: {
    ...mapActions(['favGameAction']),
  },
  computed: {
    ...mapGetters(['getFavGamesSettings', 'getGames', 'getUser', 'getFriends', 'getFriendsStatus']),
  },
};
</script>

<style lang="scss" scoped>
</style>
