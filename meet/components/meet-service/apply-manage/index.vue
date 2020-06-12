<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="申请单管理" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <ul class="house-nav-tab">
        <router-link v-for="item in pathList" :key="item.id" :to="{ path: item.path }" tag="li" @click.native="routerClick(item)" active-class = "active">
          <a>{{item.label}}</a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view />
      </keep-alive>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pathList: [], // 菜单
      breadcrumbItem: [] // 面包屑导航内容
    }
  },
  activated() {
    this.init();
  },
  methods: {
    // 初始信息
    init() {
      this.pathList = [
        { label: '服务中心申请单', path: 'conference-order', id: this.$getRandom() },
        { label: '自有申请单', path: 'own-order', id: this.$getRandom() }
      ]
      this.initPath();
    },
    // 检测路由信息
    initPath() {
      this.breadcrumbItem = ['会议服务', { name: '申请单管理', path: '/meet-service/apply-manage' }];
      for (let i = 0, len = this.pathList.length; i < len; i++) {
        if (this.$route.path.indexOf(this.pathList[i].path) > -1) {
          this.breadcrumbItem.push({ name: this.pathList[i].label, path: `/${this.pathList[i].path}` });
          break;
        } else if (i === len - 1) {
          this.$router.push({ name: this.pathList[0].path });
          this.breadcrumbItem.push({ name: this.pathList[0].label, path: `/${this.pathList[0].path}` });
        }
      }
    },
    // 切换tab
    routerClick(item) {
      this.breadcrumbItem.splice(this.breadcrumbItem.length - 1, 1, { name: item.label, path: item.path });
    }
  },
  watch: {
    // 监听路由动态
    $route(to, from) {
      if (to.path.indexOf('/meet-service/apply-manage') > -1) this.initPath();
    }
  }
}
</script>

<style>
</style>
