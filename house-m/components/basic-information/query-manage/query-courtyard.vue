<template>
  <div>
    <el-row :gutter="20" style="margin: 20px 0 0 0">
      <el-col :span="8">
        <router-link :class="this.$route.path ==='/basic-information/query-manage/query-courtyard-list/query-courtyard/roomnum'? 'router-link-exact-active router-link-active':''" :to="{path: '/basic-information/query-manage/query-courtyard-list/query-courtyard/roomnum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="roomNum">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-col :span="10">
              <div class="u-query-icons">
                <i class="iconfont icon-yuanlagailan"></i>
                <!-- <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryroom">
                <img v-if="iconShowlist[0]" :src="$store.state.imgPath.queryroomh"> -->
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <h2 class="u-query-h2">院落概览</h2>
              </div>
            </el-col>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :class="this.$route.path ==='/basic-information/query-manage/query-courtyard-list/query-courtyard/companynum'? 'router-link-exact-active router-link-active':''" :to="{path: '/basic-information/query-manage/query-courtyard-list/query-courtyard/companynum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="companyNum">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-col :span="10">
              <div class="u-query-icons">
                <i class="iconfont icon-quanshudengji"></i>
                <!-- <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.querycompany">   
              <img v-if="iconShowlist[1]" :src="$store.state.imgPath.querycompanyh">             -->
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <h2 class="u-query-h2">权属登记情况</h2>
              </div>
            </el-col>
          </div>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link :class="this.$route.path ==='/basic-information/query-manage/query-courtyard-list/query-courtyard/registernum'? 'router-link-exact-active router-link-active':''" :to="{path: '/basic-information/query-manage/query-courtyard-list/query-courtyard/registernum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="registerNum">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-col :span="10">
              <div class="u-query-icons">
                <i class="iconfont icon-fangwuweixiuqingkuang"></i>
                <!-- <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.queryregister">
                <img v-if="iconShowlist[2]" :src="$store.state.imgPath.queryregisterh"> -->
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <h2 class="u-query-h2">房屋维修情况</h2>
              </div>
            </el-col>
          </div>
        </router-link>
      </el-col>

    </el-row>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  // components: {
  //   'building-detail': buildingDetail,
  // },
  data() {
    return {
      YPromptShow: false,
      isBol: false,
      isRouterActive: true,
      message: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      activeName: 'number',
      list: [], //表格列表信息
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuData: [],
      resourceCheckedKey: [],
      courtyardId: '', // 院落ID
      courtyardName: '', //院落名称
      courtyardAddress: '', //院落地址
      id: '',//楼层id
      roomNum: '',
      useOrganNum: '',
      ownerNum: '',
      threeUrl: '',
      viewUrl: '',
      isShowLeftBannel: true,
      flag: 'area'
    };
  },
  activated() {
    if (this.$route.query.courtyardId) {
      this.courtyardId = this.$route.query.courtyardId;
      this.courtyardName = this.$route.query.courtyardName;
      this.$store.dispatch('courtyardIdActions', this.$route.query.courtyardId);
    }

    // this.$store.dispatch('courtyardIdActions', '');

    // if (sessionStorage.getItem('iconShowlist')) {
    //   this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    // }
  },
  deactivated() {
    // this.iconShowlist = [true, false, false];
    // sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },
  mounted() {
  },
  computed: {

  },
  watch: {
    // '$route.query.courtyardId': function (value) {
    //   if (!value) {
    //     this.isShowLeftBannel = true;
    //     this.$store.dispatch('courtyardIdActions', '');
    //   }
    // }
  },
  methods: {
    // reload() {
    //   this.isRouterActive = false;
    //   this.$nextTick(() => {
    //     this.isRouterActive = true;
    //     this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list/query-courtyard/roomnum' })
    //   })
    // },

  },

};
</script>
<style  lang="scss">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
</style>

<style lang="scss" scoped>
.f-size {
  font-size: 16px;
}

.u-bread {
  height: 30px;
  line-height: 30px;
}
.router-link-exact-active {
  color: #2f70ff !important;
  p {
    color: #2f70ff !important;
  }
  .u-grid-content {
    border: 1px solid #2f70ff;
  }
}
.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 10px 0;
  .u-grid-tips {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
    .iconfont {
      font-size: 53px;
    }
    // color:#606266;
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    margin-top: 17px;
    font-size: 24px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
  }
}
.el-row {
  margin: 20px 0;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  a {
    color: #606266;
  }
}
.el-col a p {
  color: #606266;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

