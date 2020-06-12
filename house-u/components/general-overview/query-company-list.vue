<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <Y-Breadcrumb title="总体概览"></Y-Breadcrumb>
      </div>
      <div class="m-company-section">
        <div class="u-treecontent">
          <el-tree :data="aCompanyTree" :accordion="true" default-expand-all ref="tree2"  :highlight-current="true" :props="defaultProps" node-key="id"  @node-click="handleCompanyNode"></el-tree>
        </div>
        <div style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link :class="iconShowlist[0]?'router-link-exact-active':''" :to="{path: '/general-overview/query-company-list/addressnum', query: {organId: loginOrganId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name=" addressnum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryaddress">
                      <img v-if="iconShowlist[0]" :src="$store.state.imgPath.queryaddressh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <h2 class="u-query-h2">单位概览</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :class="iconShowlist[1]?'router-link-exact-active':''" :to="{path: '/general-overview/query-company-list/realnum', query: {organId: loginOrganId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="realnum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.querymianji">
                      <img v-if="iconShowlist[1]" :src="$store.state.imgPath.querymianjibul">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <h2 class="u-query-h2">面积核定</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :class="iconShowlist[2]?'router-link-exact-active':''" :to="{path: '/general-overview/query-company-list/ordernum', query: {organId: loginOrganId,areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="ordernum">
                <div @click="changeImg(2)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.querydingdan">
                      <img v-if="iconShowlist[2]" :src="$store.state.imgPath.querydingdanbul">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <h2 class="u-query-h2">订单统计</h2>
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
      </div>
    </section>
  </div>
</template>
<script>
export default {
  // components: {
  //   'building-detail': buildingDetail,
  // },
  data() {
    return {

      // 左边树数据
      aCompanyTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      filterText: '',
      organName: '',
      list: [], //表格列表信息
      flag: 'area',
      isShowLeftBannel: false,
    };
  },
  activated() {
    this.getTreeData()
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
    this.getTreeData()
  },
  deactivated() {
    this.organName = '';
    this.filterText = '';
    this.iconShowlist = [true, false, false];
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  watch: {

  },
  methods: {
    // 左边树点击
    handleCompanyNode(data) {
      this.$store.dispatch('generalOrganIdActions', data.id);
    },
    //获取左侧树型菜单
    getTreeData() {
      let params = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.useSummary_getOrganLevelTree, params).then((res) => {       
        if(res.data){
          this.aCompanyTree = res.data;
          if (res.data.length === 0) {
            this.$store.dispatch('generalOrganIdActions', '');
          } else{
            this.$store.dispatch('generalOrganIdActions', res.data[0].id);
            this.organName = res.data[0].label;
          }
          if(res.data[0].id){   
            this.$nextTick(() => {      
              this.$refs.tree2.setCurrentKey(res.data[0].id)
            });
          }
        }else{
          this.aCompanyTree = [];
        }         
      })
    },
    changeImg(index) {
      let editIconShowList = [];
      this.iconShowlist.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          editIconShowList.push(true);
        } else {
          editIconShowList.push(false);
        }
        this.iconShowlist = editIconShowList;
      })
      sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
    }
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
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    margin-top: 16px;
    font-size: 28px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
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
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.m-company-section {
  height: calc(100% - 61px);
  display: flex;
  .u-treecontent {
    height: 100%;
    padding: 15px 0;
    overflow: auto;
  }
}
</style>
