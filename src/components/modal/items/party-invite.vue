<template>
  <div class="party-invite-container">
    <div class="party-top">
      <div class="party-top-left">
        <div class="party-top-left-avatar">
          <img :src="party.avatar" />
        </div>
        <div class="party-top-left-name">
          <span>{{ party.name }}</span>
        </div>
      </div>
      <div class="party-top-right">
        <div class="party-top-right-invite">
          <button @click="invite" class="btn btn-primary">Invite</button>
        </div>
      </div>
    </div>
    <div class="party-bot">

    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
.party-invite-container {
  width: 100%;
}
</style>
