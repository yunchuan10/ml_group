<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待任务" :item="['接待任务','子方案详情']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn f-cursor-pointer" @click="goBack()">
            返回
          </div>
        </div>
      </div>
     
      <ul class="house-nav-tab">
        <router-link :to="{path: '/old-manage/receptionTest/child-tab-select/meeting-list',query:{subPlanNo:this.subPlanNo,planSubId:this.id,planStatus:this.planStatus,planNo:this.planNo,planId:this.planId,receivePlatId:this.receivePlatId,userType:this.userType}}" exact tag="li">
          <a>会议方案</a>
        </router-link>
        <router-link :to="{path: '/old-manage/receptionTest/child-tab-select/accommodation-list',query:{subPlanNo:this.subPlanNo,planSubId:this.id,planStatus:this.planStatus,planNo:this.planNo,planId:this.planId,receivePlatId:this.receivePlatId,userType:this.userType}}" :class='isActive' tag="li">
          <a>住宿方案</a>
        </router-link>
      <router-link :to="{path: '/old-manage/receptionTest/child-tab-select/meals-list',query:{subPlanNo:this.subPlanNo,planSubId:this.id,planStatus:this.planStatus,planNo:this.planNo,planId:this.planId,receivePlatId:this.receivePlatId,userType:this.userType}}" :class='isActive' tag="li">
          <a>用餐方案</a>
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
      id:'',//查询主键id
      subPlanNo:'',//查询子方案号
      planStatus:'',//方案状态
      planNo:'',//查询主方案号
      planId:'',//主方案id
      receivePlatId:'',//接收方id
      userType:'',//角色身份
      pathList: [{
        path: '/old-manage/receptionTest/child-tab-select/meeting-list',
        label: '会议子方案'
      },
      {
        path: '/old-manage/receptionTest/child-tab-select/accommodation-list',
        label: '住宿子方案'
      },
      {
        path: '/old-manage/receptionTest/child-tab-select/meals-list',
        label: '用餐子方案'
      },
      ]
    };
  },
  activated() {
    this.userType = this.$route.query.userType
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
    goBack(){
      // this.$router.go(-2)
      this.$router.push({ path: '/old-manage/receptionTest/tab/hotel-plan-list' ,query:{planNo:this.planNo,id:this.planId,userType:this.userType}})
    },
    // reload() {
    //   this.isRouterActive = false;
    //   this.$nextTick(() => {
    //     this.isRouterActive = true;
    //     this.$router.push({ path: '/use-manage/use-list/voucher-list' })
    //   })
    // },
    selectRoute() {
      this.id = this.$route.query.planSubId
      this.subPlanNo = this.$route.query.subPlanNo
      this.planStatus = this.$route.query.planStatus
      this.planNo = this.$route.query.planNo
      this.planId = this.$route.query.planId
      this.receivePlatId = this.$route.query.receivePlatId
      if(this.$route.query.planType === '1'){//住宿方案
        this.activeState = this.pathList[1].path;
      }else if(this.$route.query.planType === '3'){//会议方案
        this.activeState = this.pathList[0].path;
      }else{
        this.activeState = this.pathList[2].path;
      }
      // this.activeState = this.pathList[0].path;
      for (let i = 0, len = this.pathList.length; i < len; i++) {
        if (this.pathList[i].path === this.$route.path) {
          this.activeState = this.pathList[i].path;
          break;
        } else if (i === len - 1) {
          this.$router.push({ path: this.activeState ,query:{subPlanNo:this.subPlanNo,planSubId:this.id,planStatus:this.planStatus,planNo:this.planNo,planId:this.planId,receivePlatId:this.receivePlatId,userType:this.userType}})
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
};
.button{
    float: right;
    margin-top : 10px;
    margin-right: 30px;
}
</style>
