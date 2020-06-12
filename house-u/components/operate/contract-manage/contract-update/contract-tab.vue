<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="合同管理" :item="['合同管理']" type="2"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/info',query:{id:this.id}}" @mouseover.native="overTag" exact tag="li">
          <a>基本信息</a>
        </router-link>
        <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/content',query:{id:this.id}}" @mouseover.native="overTag" tag="li">
          <a>合同正文</a>
        </router-link>
        <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/remind',query:{id:this.id}}" @mouseover.native="overTag" tag="li">
          <a>合同到期提醒</a>
        </router-link>
        <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/rental',query:{id:this.id}}" @mouseover.native="overTag" tag="li">
          <a>租金入账情况</a>
        </router-link>
        <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/file',query:{id:this.id}}" @mouseover.native="overTag" tag="li">
          <a>附件</a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view v-if="isRouterActive"></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
// import approvalInfo from '@/components/configure-manage/room-approval/approval-info'; // 审批弹出框
// import approvalDetail from '@/components/configure-manage/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    // 'approval-detail': approvalDetail,
    // 'approval-info': approvalInfo,
  },
  data() {
    return {
      handleType: 'RENT',
      isRouterActive: true,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      pathList: [
        '/operate/contract-manage/contract-update/contract-tab/info',
        '/operate/contract-manage/contract-update/contract-tab/content',
        '/operate/contract-manage/contract-update/contract-tab/remind',
        '/operate/contract-manage/contract-update/contract-tab/rental',
        '/operate/contract-manage/contract-update/contract-tab/file'
      ],
      activeState: '',
      id: '', //新增合同传值
    };
  },
  activated() {
    this.id = this.$route.query.id;
    // if (this.$route.path === '/operate/contract-manage/contract-update/contract-tab/info') {
    this.reload()
    // }
    this.selectRoute();

  },
  computed: {
  },
  methods: {
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/info', query: { id: this.id } })
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
    overTag() {
      this.id = this.$route.query.id;
    }
  },

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
