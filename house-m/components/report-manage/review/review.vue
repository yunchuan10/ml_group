<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据审核" :item="['数据审核']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" @click="reviewClick">批量审批</button>
        </div>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <router-link :to="{path: '/report-manage/review/next-level-list'}" exact tag="li">
          <a>下级地区上报数据</a>
        </router-link>
        <router-link :to="{path: '/report-manage/review/same-level-list'}" tag="li">
          <a>本级单位上报数据</a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view v-if="isRouterActive"></router-view>
      </keep-alive>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      isRouterActive: true,
      pathList: [
        '/report-manage/review/next-level-list',
        '/report-manage/review/same-level-list'
      ],
      activeState: ''
    }
  },
  computed: {
    reportReviewPage() {
      return this.$store.state.mainData.reportReviewPage;
    }
  },
  activated() {
    if (this.$route.path === '/report-manage/review/next-level-list') {
      this.reload()
    }
    this.selectRoute();
  },
  methods: {
    reviewClick() {
      if (this.$route.path == '/report-manage/review/next-level-list') {
        this.$store.commit('reportReviewPageMutations', 'nextLevel');
      } else {
        this.$store.commit('reportReviewPageMutations', 'someLevel');
      }
    },
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        this.$router.push({ path: '/report-manage/review/next-level-list' })
      })
    },

    selectRoute() {
      this.activeState = this.pathList[0];
      for (let i = 0, len = this.pathList.length; i < len; i++) {
        if (this.pathList[i] === this.$route.path) {
          this.activeState = this.pathList[i];
          break;
        } else if (i === len - 1) {
          this.$router.push({ path: this.activeState })
        }
      }
    },
    YPromptClick() {

    }
  }
}
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