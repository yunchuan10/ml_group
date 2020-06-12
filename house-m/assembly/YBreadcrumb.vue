<!-- 面包屑 -->
<template>
  <div class="m-col">
    <span class="m-title s-title">{{title}}</span>
    <div class="m-title-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-show="type == '1'" :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-show="type == '2'" :to="{ path: '/operate/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :class="index == item.length - 1 ? 'active' : ''" v-for="(it, index) in item" :key="index">
          <span @click="jump(it)">{{filter(it)}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * title: 当前页名称
   * item: 层级
   * type: 首页类型， 1为办公用房  2为经营性房产
   */
  props: ['title', 'item', 'type'],
  methods: {
    filter(val) {
      if (val) {
        if (val instanceof Object) {
          val = val.name
        }
      }
      return val;
    },
    jump(val) {
      if (val instanceof Object) {
        val = val.path
      }
      if (val) {
        if (val.indexOf('/') > -1) {
          this.$router.push({ path: val });
        }
      }
    }
  }
}
</script>
