<template>
  <div class="mian">
    <div class="jurisdiction">
      <img :src="$store.state.imgPath.jurisdiction">
    </div>
    <h1>{{Tips}}</h1>
  </div>
</template>
<script>

export default {
  data() {
    return {
      Tips: '',
    }
  },
  activated() {
    this.Tips = this.$route.query.Tips;
  }
}
</script>
<style lang="scss" scoped>
.mian {
  margin-right: 8%;
  font-size: 25px;
  text-align: center;
  h1 {
    margin: 50px 0px 0 0;
  }
  .jurisdiction {
    margin-top: 50px;
  }
}
</style>