<template>
  <keep-alive>
    <router-view/>
  </keep-alive>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="scss">
/*公共样式结构*/
@import "@/assets/scss/main.scss";
/*默认皮肤样式*/
@import "@/assets/scss/skin/default.scss";
@import "@/assets/scss/skin/a.scss";
</style>