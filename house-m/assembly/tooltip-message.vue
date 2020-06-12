<template>
  <div class="tooltip">
    <el-tooltip effect="dark" placement="right">
      <div slot="content">
        <p v-for="item in messages" :key="item">
          {{item}}
        </p>
      </div>
      <i class="iconfont icon-gantanhao"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: ['messages']
};
</script>
<style lang="scss" scoped>
.el-table th div {
  line-height: 23px;
}
.icon-gantanhao:before {
  color: #c0c4cc;
}
</style>

