<template>
  <div class="userInfo-container">
    <h2 class="username roboto-medium username-nowrap" v-if="user">
      {{user.username}}
    </h2>
    <button class="copyUsername-btn">
      <img src="@/assets/copy.svg" alt="copy button" draggable="false">
    </button>

  </div>
</template>

<script>
export default {
  name: 'userInfo',
  props: {
    user: Object,
  },
};
</script>

<style lang="scss" scoped>
.userInfo-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
// username
.username{
  color: #fff;
  font-size: 18px;
  padding-left:6px;
  display: flex;
  align-items: center;
  // margin-right: 12px;
}

// copy button
.copyUsername-btn{
  border: none;
  border-radius: 6px;
  // color: #fff;
  background-color: transparent;
  // padding: 4px;
  padding-top: 4px;
}
.copyUsername-btn:hover{
  background-color: #2B2E43;

}
</style>
