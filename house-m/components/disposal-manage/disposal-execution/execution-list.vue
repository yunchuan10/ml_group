<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置执行" :item="['处置执行']" type="1"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <router-link :to="{path: '/disposal-manage/disposal-execution/execution-list/rent'}" exact tag="li">
          <a>出租</a>
        </router-link>
        <router-link :to="{path: '/disposal-manage/disposal-execution/execution-list/auction'}" tag="li">
          <a>拍卖</a>
        </router-link>
        <router-link :to="{path: '/disposal-manage/disposal-execution/execution-list/demolish'}" tag="li">
          <a>拆除</a>
        </router-link>
        <router-link :to="{path: '/disposal-manage/disposal-execution/execution-list/purpose'}" tag="li">
          <a>转换用途</a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view v-if="isRouterActive"></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
import approvalInfo from '@/components/configure-manage/room-approval/approval-info'; // 审批弹出框
import approvalDetail from '@/components/configure-manage/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail,
    'approval-info': approvalInfo,
  },
  data() {
    return {
      handleType: 'RENT',
      isRouterActive: true,
      floorName: '', // 楼座名称
      courtyardName: '',// 院落名称
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      pathList: [
        '/disposal-manage/disposal-execution/execution-list/rent',
        '/disposal-manage/disposal-execution/execution-list/auction',
        '/disposal-manage/disposal-execution/execution-list/demolish',
        '/disposal-manage/disposal-execution/execution-list/purpose'
      ],
      activeState: ''
    };
  },
  activated() {
    if (this.$route.path === '/disposal-manage/disposal-execution/execution-list/rent') {
      this.reload()
    }
    this.selectRoute()
  },
  computed: {
  },
  methods: {
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        this.$router.push({ path: '/disposal-manage/disposal-execution/execution-list/rent' })
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
    clickTab(value) {
      this.activeState = value;
    },
    approvalInfoClick() {
      this.$refs.approvalInfo.openModal();
    },
    // 详情
    approvalDetailClick() {
      this.$refs.approvalDetail.openModal();
    }
  }
};
</script>

<style lang="scss" scoped >
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
