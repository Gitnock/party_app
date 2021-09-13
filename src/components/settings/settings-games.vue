<template>
  <div class="settings-password-main">
    <div class="content-main" v-show="getFavGamesSettings.length > 0">
      <transition-group name="list" tag="div">
        <div
          v-for="game in getFavGamesSettings"
          :key="game.gameId"
          class="game-card"
        >
          <div class="game-img-container">
            <img class="game-img" :src="game.url_square" alt="game-image" />
          </div>
          <div class="game-card-content">
            <div>
              <h2 class="gname roboto-m">{{ game.gameName }}</h2>
              <h3 class="uname roboto-m">{{ game.uname }}</h3>
            </div>
            <div class="game-options-container">
              <button class="game-options" @click="deleteGame(game.gameId)">
                <i class='bx bxs-x-circle game-options-txt'></i>
              </button>
            </div>
          </div>
        </div>
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
import { usersCollection } from '../../firebaseConfig';

export default {
  name: 'settings-password-page',
  data() {
    return {};
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
    openNotification(title, text, color) {
      this.$vs.notification({
        // flat: true,
        title,
        text,
        position: 'bottom-center',
        color,
      });
    },
  },
  computed: {
    ...mapGetters(['getFavGamesSettings', 'getGames', 'getUser']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';
.game-card {
  height: 102px;
  width: 100%;
  background-color: $c2_dark;
  margin-bottom: 12px;
  display: flex;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.game-img-container {
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 16px;
  overflow: hidden;
}
.game-img {
  height: 100%;
  width: 70px;
  object-fit: cover;
  border-radius: 8px;
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
.game-card-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.gname {
  font-size: 16px;
  color: $c5_dark;
}
.uname {
  font-size: 12px;
  color: #626891;
}
.game-options-container{
  display: flex;
  align-items: center;
}
.game-options {
  padding: 0px;
  border: none;
  background-color: transparent;
  height: 24px;
}
.game-options-txt {
  font-size: 24px;
  color: #464A65;
}

//animations
.list-enter, .list-leave-to{
  opacity: 0;
}
</style>
