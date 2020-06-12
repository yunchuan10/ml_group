<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <span class="re-info fl">资源信息</span>
          <span class="re-space fl"></span>
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>资源信息</el-breadcrumb-item>
        </el-breadcrumb> -->
        <zl-breadcrumb title="院落管理" :item="['院落管理']"></zl-breadcrumb>
        <!-- <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn">
            <router-link to="/basic-information/courtyard-manage/courtyard-update/add">新增院落</router-link>
          </button>
        </div>-->
      </div>

      <!-- tab -->
      <div class="tab-wrap">
        <ul class="house-nav-tab">
          <router-link to="/resource-manage/resource-map" exact active-class="active" tag="li">
            <a>总览</a>
          </router-link>
          <router-link to="/resource-manage/resource-info" active-class="active" tag="li">
            <a>具体详情</a>
          </router-link>
        </ul>
        <router-view>
          <keep-alive></keep-alive>
        </router-view>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: true,
      activeName2: 'overview',
    };
  },
  activated() {
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss">
.re-info {
  font-size: 16px;
  // font-weight: bold;
  // font-family: Microsoft YaHei;
}
.re-space {
  margin-left: 18px;
  padding: 0 5px;
  height: 16px;
  display: inline-block;
  border-left: 1px #000 solid;
  border-color: #dcdfe6;
}
.el-tabs--border-card > .el-tabs__header {
  background-color: #fff;
}
// tab
.tab-wrap {
  margin-top: 10px;
}
.tab-overview {
  width: 80px;
  display: inline-block;
  text-align: center;
}
.el-tabs--border-card {
  border: 0px;
  box-shadow: none;
}
.house-nav-tab {
  margin-bottom: 15px;
  li a {
    height: 35px;
  }
  .active a {
    border-radius: 3px;
    height: 36px;
    border-bottom: 0px solid #dcdcdc;
  }
}
.fl {
  float: left;
}
</style>
