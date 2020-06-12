<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="使用管理" :item="['使用管理']" type="1"></Y-Breadcrumb>
      </div>
      <ul class="house-nav-tab">
        <router-link :to="{path: '/use-manage/use-list/voucher-list'}" exact tag="li">
          <a>凭证发放概览</a>
        </router-link>
        <router-link :to="{path: '/use-manage/use-list/style-list'}" :class='isActive' tag="li">
          <a>样式预览</a>
        </router-link>
        <router-link :to="{path: '/use-manage/use-list/archives-list'}" tag="li">
          <a>档案库</a>
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
        path: '/use-manage/use-list/voucher-list',
        label: '凭证发放概览'
      },
      {
        path: '/use-manage/use-list/style-list',
        label: '样式预览'
      },
      {
        path: '/use-manage/use-list/archives-list',
        label: '档案库'
      }
      ]
    };
  },
  activated() {
    this.selectRoute()
    // this.reload()
  },
  deactivated() {
    this.$destroy()
  },
  computed: {
  },
  methods: {
    getMsg(data) {
      this.isActive = data
    },
    // reload() {
    //   this.isRouterActive = false;
    //   this.$nextTick(() => {
    //     this.isRouterActive = true;
    //     this.$router.push({ path: '/use-manage/use-list/voucher-list' })
    //   })
    // },
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
