<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="scss">
#app { height: 100%; }
</style>
