<template>
  <vs-navbar
    color="#2F3247"
    text-white
    square
    center-collapsed
    v-model="active"
  >
    <template #left>
      <img src="@/assets/partyapp_logo.svg" alt="" class="partyapp-logo" />
      <vs-select color="success" v-model="value" class="roboto-midurm">
        <vs-option label="Valorant" value="1"> Valorant </vs-option>
        <vs-option label="Warzone" value="2"> Warzone </vs-option>
      </vs-select>
    </template>
    <template #right>
      <vs-button color="#fff" size="large" flat>Login</vs-button>
    </template>
  </vs-navbar>
</template>

<script>
export default {
  name: 'nav',
  data: () => ({
    value: '1',
  }),
  mounted() {
    this.$vs.theme = 'dark';
  },
};
</script>

<style lang="scss" scoped>
[vs-theme='dark'] {
  --vs-background: 30, 32, 35;
  --vs-text: 255, 255, 255;
  --vs-gray-1: 24, 25, 28;
  --vs-gray-2: 20, 20, 23;
  --vs-gray-3: 15, 16, 19;
  --vs-gray-4: 10, 11, 14;
  --vs-shadow-opacity: 0.3;
  --vs-dark: 0, 0, 0;
  --vs-background-opacity: 0.6;
}
[vs-theme='dark'] {
  background-color: rgba(var(--vs-background), 1);
  color: rgba(var(--vs-text), 1);
}
.main {
  background-color: antiquewhite;
}
.partyapp-logo {
  height: 38px;
  padding: 13px 8px;
}
</style>
