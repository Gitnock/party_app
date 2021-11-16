<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container-full">
          <div class="full-close-container">
            <div></div>
            <button
              class="close-circle btn-div clickable btn-drop"
              @click="$emit('close')"
            >
              <i class="bx bx-x close-icon" style="color: #ffffff"></i>
            </button>
          </div>
          <div class="full-content">
            <slot name="body"/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
};
</script>

<style lang="scss">
@import '@/assets/styles/friends';
.full-close-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 12px 24px 0;
}
.close-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #2b2e43;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-icon {
  font-size: 24px;
}

//top
.full-top {
  margin: 0 0 42px 22px;
}
.full-title {
  font-size: 32px;
  color: white;
}

//mid
.full-mid {
  display: flex;
  justify-content: center;
}
.full-mid-content {
  width: 642px;
}

@media screen and (max-width: 705px) {
  .full-top {
    margin: 0 0 42px 12px;
  }
  .full-mid-content {
    width: 379px;
  }
  .full-title {
    font-size: 24px;
  }
}

@media screen and (max-width: 510px) {
  .full-top {
    margin: 0 0 22px 0;
  }
}
</style>
