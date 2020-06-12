<template>
  <div>
    <div style="background:url(/static/icon/default/img/wtjd1.png ) no-repeat; width:100%; height: 960px;background-size: contain;">
      <router-link to="./taxi-jump2">
        <button class="ama transparent">新建新建</button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="scss" scoped>
.ama {
  width: 100px;
  margin: 70px 15px 0 0px;
  float: right;
  height: 51px;
}
.transparent {
  background-color: transparent;
  color: transparent;
  border-style: none;
}
</style>