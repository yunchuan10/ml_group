<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size">{{organName || ''}}</div>
        <div class="u-bread-btn-group">

          <router-link :to="{path:'/plane/Sketchpad-company',query:{organId:organId}}" target="_blank">
            <button class="f-pull-right u-bread-btn">
              平面图模式
            </button>
          </router-link>
          <!-- <a @click="searchAll">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </a> -->
          <!-- <router-link :to="{path: '/main/homemap/map-company', query: {areaId: $route.query.areaId, areaType:  $route.query.areaType}}">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              返回
            </button>
          </router-link> -->
        </div>
      </div>
      <div style="height: calc(100% - 61px);display:flex;">
        <div v-if="treeOpen" class="u-treecontent" style="height: 100%;">
          <!-- <ul class="u-subnavbar">
            <li>
              <router-link to="/basic-information/query-manage/query-courtyard-list/query-courtyard/roomnum">
                <a>按院落查询</a>
              </router-link>
            </li>
            <li class="c2">
              <a>按使用单位查询</a>
            </li>
          </ul> -->
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入使用单位" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree class="filter-tree" :accordion="true" @node-click="updateorganName" :highlight-current="true" default-expand-all :data="roomNoteList" node-key="organId" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
            </el-tree>
          </div>
        </div>
        <div style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link :class="iconShowlist[0]?'router-link-exact-active':''" :to="{path: '/basic-information/query-manage/query-company-list/addressnum', query: {organId: $route.query.organId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name=" addressnum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
                  <!-- <el-tooltip class="item u-grid-tips" effect="dark" content="单位地址是指分配给该单位使用且地理位置上不是同一个院落的数量" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip> -->
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img style="width:52px;height:50px" v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryaddress">
                      <img style="width:52px;height:50px" v-if="iconShowlist[0]" :src="$store.state.imgPath.queryaddressh">
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
              <router-link :class="iconShowlist[1]?'router-link-exact-active':''" :to="{path: '/basic-information/query-manage/query-company-list/realnum', query: {organId: $route.query.organId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="realnum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
                  <!-- <el-tooltip class="item u-grid-tips" effect="dark" content="实际人数是指当前查询条件下系统内属于本单位的人员数量，
                  包括编制内人员、借调人员、外聘人员等。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip> -->
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img style="width:52px;height:50px" v-if="!iconShowlist[1]" :src="$store.state.imgPath.querymianji">
                      <img style="width:52px;height:50px" v-if="iconShowlist[1]" :src="$store.state.imgPath.querymianjibul">
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
              <router-link :class="iconShowlist[2]?'router-link-exact-active':''" :to="{path: '/basic-information/query-manage/query-company-list/ordernum', query: {organId: $route.query.organId,areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="ordernum">
                <div @click="changeImg(2)" class="grid-content u-grid-content f-relative f-clearfix">
                  <!-- <el-tooltip class="item u-grid-tips" effect="dark" content="房屋维修次数是指当前查询条件下本单位发生的维修次数，默认为当前年度，可跨越多个年份进行查询汇总。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip> -->
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img style="width:45px;height:52px" v-if="!iconShowlist[2]" :src="$store.state.imgPath.querydingdan">
                      <img style="width:45px;height:52px" v-if="iconShowlist[2]" :src="$store.state.imgPath.querydingdanbul">
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
  data() {
    return {
      treeOpen: true,//树展开
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      iconShowlist: [true, false, false],
      activeName: 'number',
      filterText: '',
      organName: '',
      list: [], //表格列表信息
      organList: [], //单位集合
      userId: '', //用户名id
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      storeysLabel: '', //楼层名称
      organAddressNum: '', //	单位地址数
      realPersonNum: '', //实际人数
      houseRepairNum: '', // 房屋维修次数
      flag: 'area',
      isShowLeftBannel: false
    };
  },
  activated() {
    this.treeOpen = true;
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
    if (this.$route.query.organId) { // 是否是从首页进入
      // this.isShowLeftBannel = false;
      this.organName = this.$route.query.organName;
      this.$store.dispatch('organIdActions', this.$route.query.organId);
      // this.getCompanydata();
      this.treeOpen = false
    } else {
      // this.isShowLeftBannel = true;
      if (!this.$route.query.formPage) {
        this.$store.dispatch('organIdActions', '');
      }
      this.getRoomTree();
    }
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
    organId() {
      return this.$store.state.mainData.organId
    },
    areaLevel() {
      return this.$store.state.mainData.areaLevel
    }
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree2.filter(val);
    },
    // 'areaId': function (val) {
    //   this.getRoomTree();
    // },
    '$route.query.organId': function (value) {
      if (!value) {
        this.isShowLeftBannel = true;
        this.$store.dispatch('organIdActions', '');
        this.getRoomTree();
      }
    }
  },
  methods: {
    searchAll() {
      this.$router.push({ path: '/basic-information/query-manage/query-company-list/addressnum' });
      this.$store.dispatch('organIdActions', '');
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
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getRoomTree() {
      this.$axiosGet(API.organSearch2_getOrganTree, {}).then(res => {
        if (res.data) {
          this.roomNoteList = res.data;
          if (this.$route.query.formPage == 'courtyardOrgan') {
            for (let i = 0, j = this.roomNoteList.length; i < j; i++) {
              if (this.organId == this.roomNoteList[i].organId) {
                this.organName = this.roomNoteList[i].label;
              }
            }
          } else {
            if (res.data.length === 0) {
              this.$store.dispatch('organIdActions', '');
            } else {
              this.$store.dispatch('organIdActions', res.data[0].organId);
              this.organName = res.data[0].label;
            }
          }
          if(res.data[0].organId){   
            this.$nextTick(() => {
              if (this.treeOpen) {
                if (this.$route.query.formPage == 'courtyardOrgan') {
                  this.$refs.tree2.setCurrentKey(this.organId)

                } else {
                  this.$refs.tree2.setCurrentKey(res.data[0].organId)
                }
              }
            });
          }
          // this.getCompanydata();
        } else {
          this.roomNoteList = [];
        }
      })
    },
    getCompanydata() {
      let params = {
        organId: this.organId
      }
      this.$axiosPost(API.organSearch_organPageData, params).then(res => {
        if (res.data) {
          this.organAddressNum = res.data.organAddressNum || '0';
          this.realPersonNum = res.data.realPersonNum || '0';
          this.houseRepairNum = res.data.houseRepairNum || '0';
        } else {
          this.organAddressNum = '0';
          this.realPersonNum = '0';
          this.houseRepairNum = '0';
        }
      })
    },
    updateorganName(data) {
      this.$store.dispatch('organIdActions', data.organId);
      this.organName = data.label;
      // this.getCompanydata();
   
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
    margin-top: 18px;
    font-size: 24px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
}
.el-row {
  margin: 20px 0 0 0;
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
