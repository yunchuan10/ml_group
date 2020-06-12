<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="日常上报" :item="['日常上报']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/daily-report/report-list'>
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <ul class="house-nav-tab">
        <router-link :to="{path: '/daily-report/detail/info'}" exact tag="li">
          <a>通知详情</a>
        </router-link>
        <router-link :to="{path: '/daily-report/detail/history'}" :class='isActive' tag="li">
          <a>上报记录</a>
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
        path: '/daily-report/detail/info',
        label: '通知详情'
      },
      {
        path: '/daily-report/detail/history',
        label: '上报统计'
      }]
    };
  },
  activated() {
    this.selectRoute()
    this.reload()
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
        this.$router.push({ path: '/daily-report/detail/info' })
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
    clickTab(value) {
      this.activeState = value;
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