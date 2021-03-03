<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss" scoped>
@import "./assets/styles/init.css";
$color_one: #2b2e43;
$color_two: #2f3247;
$color_three: #737684;
$color_four: #25514d;
$color_five: #00cd69;

#app {
  background: $color_one;
}
html {
  height: 100%;
  overflow-y: auto;
}

</style>
