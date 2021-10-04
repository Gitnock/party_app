<template>
  <div class="friend-item-container">
    <div class="friend-card">
      <div class="friend-img-container">
        <img class="friend-img" :src="friend.url_square" alt="friend-image" />
      </div>
      <div class="friend-card-content">
        <div>
          <h2 class="gname roboto-m">{{ friend.gameName }}</h2>
          <h3 class="uname roboto-m">{{ friend.uname }}</h3>
        </div>
        <div class="friend-options-container">
          <vs-avatar success>
            <template #text> Success </template>
          </vs-avatar>
          <button class="friend-options" @click="deletefriend(friend.friendId)">
            <i class="bx bxs-x-circle friend-options-txt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'friends-friend-item',
  data: () => ({
    key: '',
  }),
  props: {
    friend: {},
  },
};
</script>

<style lang="scss" scoped>
.friend-item-container {
  width: 100%;
}
.friend-card {
  height: 102px;
  width: 100%;
  background-color: $c2_dark;
  margin-bottom: 12px;
  display: flex;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.friend-img-container {
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 16px;
  overflow: hidden;
}
.friend-img {
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
.friend-card-content {
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
.friend-options-container {
  display: flex;
  align-items: center;
}
.friend-options {
  padding: 0px;
  border: none;
  background-color: transparent;
  height: 24px;
}
.friend-options-txt {
  font-size: 24px;
  color: #464a65;
}
</style>
