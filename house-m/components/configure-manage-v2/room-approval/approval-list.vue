<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="用房审批" :item="['用房审批']" type="1"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <router-link :to="{path: '/configure-manage-v2/room-approval/approval-list/wait'}" exact tag="li">
          <a>待处理
            <i class="f-weight-bold">（{{waitTotal}}）</i>
          </a>
        </router-link>
        <router-link :to="{path: '/configure-manage-v2/room-approval/approval-list/plan'}" tag="li">
          <a>已处理
            <i class="f-weight-bold">（{{planTotal}}）</i>
          </a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数8'sis s
    };
  },
  activated() {
    if (this.$route.query.id) {
      this.$store.commit('navIdMutations', this.$route.query.id);
      this.$router.push({ path: '/configure-manage-v2/room-approval/approval-list/wait' })
    }
    this.getTotalApply();
  },
  computed: {
    myPlanPageUpdate() {
      return this.$store.state.mainData.myPlanPageUpdate;
    }
  },
  watch: {
    myPlanPageUpdate(value) {
      if (value == 'YES') {
        this.getTotalApply();
      }
    }
  },
  methods: {
    getTotalApply() {
      let params = {
        businessCode: 'CONFIGURATION',
        platForm: 'manageSystem'
      }
      this.$axiosGet(API.officeapply_getTotalApply, params).then(res => {
        if (res.result === 'success') {
          this.waitTotal = res.data.toDoNum; // 待处理订单总数
          this.planTotal = res.data.doneNum; // 已处理订单总数
          this.$store.commit('myPlanPageUpdateMutations', 'NO');
        }
      })
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