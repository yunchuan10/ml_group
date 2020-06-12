<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据上报" :item="['数据上报']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" v-show="reportOperatStatus !== 'detail'">导入数据</button>
          <button class="u-bread-btn" v-show="reportOperatStatus !== 'detail'" @click="submitClick">上报数据</button>
          <button @click="goAddPageClick" v-show="reportPageStatus != '1' && reportOperatStatus !== 'detail'" class="u-bread-btn">新增</button>
          <button @click="goBack" class="u-bread-btn">返回</button>
        </div>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <router-link :to="{path: '/report-manage/report/administrative-division'}" exact tag="li">
          <a>行政区划信息</a>
        </router-link>
        <router-link :to="{path: '/report-manage/report/office-house'}" tag="li">
          <a>办公用房</a>
        </router-link>
        <router-link :to="{path: '/report-manage/report/technology-house'}" tag="li">
          <a>技术业务用房</a>
        </router-link>
        <router-link :to="{path: '/report-manage/report/construction-project'}" tag="li">
          <a>办公用房建设项目</a>
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
        '/report-manage/report/administrative-division',
        '/report-manage/report/office-house',
        '/report-manage/report/technology-house',
        '/report-manage/report/construction-project'
      ],
      activeState: ''
    }
  },
  activated() {
    if (this.$route.path === '/report-manage/report/administrative-divisiont') {
      this.reload()
    }
    this.selectRoute();
  },
  deactivated() {
    this.$destroy()
  },
  computed: {
    reportPageStatus() {
      return this.$store.state.mainData.reportPageStatus;
    },
    reportOperatStatus() {
      return this.$store.state.mainData.reportOperatStatus;
    },
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    },
    reportBackPage() {
      return this.$store.state.mainData.reportBackPage;
    }
  },
  methods: {
    goBack() {
      if (this.reportBackPage == 'report') {
        this.$router.push({ path: '/report-manage/report-list' })
      } else if (this.reportBackPage == 'reviewNext') {
        this.$router.push({ path: '/report-manage/review/next-level-list' })
      } else if (this.reportBackPage == 'reviewSame') {
        this.$router.push({ path: '/report-manage/review/same-level-list' })
      } else {
        this.$router.push({ path: '/report-manage/search/search-list' })
      }
    },
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        this.$router.push({ path: '/report-manage/report/administrative-division' })
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
    goAddPageClick() {
      if (this.reportPageStatus == '2') {
        this.$router.push({ path: '/report-manage/report/office-house-update/add' })
      } else if (this.reportPageStatus == '3') {
        this.$router.push({ path: '/report-manage/report/technology-house-update' })
      } else if (this.reportPageStatus == '4') {
        this.$router.push({ path: '/report-manage/report/construction-project-update' })
      }
    },
    submitClick() {
      let params = {
        id: this.dataReportOrderId
      }
      this.$axiosGet(API.report_startReport, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '数据上报', '上报数据')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push({ path: '/report-manage/report-list' })
      }
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