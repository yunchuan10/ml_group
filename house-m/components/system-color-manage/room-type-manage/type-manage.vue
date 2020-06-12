<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="系统配色"></Y-Breadcrumb>
      </div>
      <ul class="house-nav-tab">
        <router-link :to="{path: '/system-color/room-type/type'}" exact tag="li">
          <a>房间类型配色</a>
        </router-link>
        <router-link :to="{path: '/system-color/room-type/company'}" :class='isActive' tag="li">
          <a>使用单位配色</a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view v-if="isRouterActive" @getMsg="getMsg"></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      isActive: '',
      isRouterActive: true,
      activeState: '',
      pathList: [{
        path: '/system-color/room-type/type',
        label: '办公室'
      },
      {
        path: '/system-color/room-type/company',
        label: '服务用房'
      }]
    };
  },
  activated() {
    this.$store.commit('systemAreaOpenMutations', 'NO');
    this.selectRoute()
    this.reload()
  },
  deactivated() {
    this.$store.commit('systemAreaOpenMutations', 'NO');
  },
  computed: {
  },
  methods: {
    getMsg(data) {
      this.isActive = data
    },
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        // this.$router.push({ path: '/system-color/room-type/type' })
      })
    },
    selectRoute() {
      this.activeState = this.pathList[0].path;
      for (let i = 0, len = this.pathList.length; i < len; i++) {
        if (this.pathList[i].path === this.$route.path) {
          this.activeState = this.pathList[i].path;
          break;
        } else if (i === len - 1) {
          this.$router.push({ path: this.activeState })
        }
      }
    },
    setDialogShowStatus() {
      this.$store.commit('systemAreaOpenMutations', 'YES')
    }
  }
};
</script>

<style lang="scss" scoped>
.router-link-active {
  a {
    border-top: 4px solid #2f70ff;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    color: #2f70ff;
    line-height: 33px;
  }
}
</style>
   