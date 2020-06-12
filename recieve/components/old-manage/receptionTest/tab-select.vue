<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待任务" :item="['接待任务']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
            <div class="f-pull-right u-bread-btn f-cursor-pointer" @click=" goBack()">
              返回
            </div>
          </div>
      </div>
      
      <ul class="house-nav-tab">
        <router-link
          :to="{path: '/old-manage/receptionTest/tab-select/basic-info',query:{planNo:this.planNo,id:this.id,userType:this.userType}}"
          exact
          tag="li"
        >
          <a>基础信息</a>
        </router-link>
        <!-- <router-link
          :to="{path: '/old-manage/receptionTest/tab-select/receptionTestList',query:{planNo:this.planNo,id:this.id,userType:this.userType}}"
          :class="isActive"
          tag="li"
        >
          <a>子方案</a>
        </router-link> -->
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
      isActive: "",
      isRouterActive: true,
      activeState: "",
      id: "", //携带查询主键
      planNo: "", //携带方案号
      userType: "", //用户类型
      pathList: [
        {
          path: "/old-manage/receptionTest/tab-select/basic-info",
          label: "基础信息"
        },
        {
          path: "/old-manage/receptionTest/tab-select/receptionTestList",
          label: "子方案"
        }
      ]
    };
  },
  activated() {
    this.selectRoute();
    // this.reload()
  },
  deactivated() {
    this.$destroy();
  },
  computed: {},
  methods: {
    getMsg(data) {
      this.isActive = data;
    },
    goBack() {
      // this.$router.go(-2)
      if (this.$route.query.userType === "hotel") {
        this.$router.push({
          path: "/old-manage/receptionTest/tab/hotel-plan-list"
        });
      }else{
        this.$router.push({
          path: "/old-manage/receptionTest/tab/car-plan-list"
        });
      }
    },
    // reload() {
    //   this.isRouterActive = false;
    //   this.$nextTick(() => {
    //     this.isRouterActive = true;
    //     this.$router.push({ path: '/use-manage/use-list/voucher-list' })
    //   })
    // },
    selectRoute() {
      this.id = this.$route.query.id;
      this.planNo = this.$route.query.planNo;
      this.userType = this.$route.query.userType;
      this.activeState = this.pathList[0].path;
      for (let i = 0, len = this.pathList.length; i < len; i++) {
        if (this.pathList[i].path === this.$route.path) {
          this.activeState = this.pathList[i].path;
          break;
        } else if (i === len - 1) {
          this.$router.push({
            path: this.activeState,
            query: { planNo: this.planNo, id: this.id, userType: this.userType }
          });
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
.button{
    float: right;
    margin-top : 10px;
    margin-right: 30px;
}
</style>
