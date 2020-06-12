<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size">{{organName || '按使用单位查询'}}</div>
        <div class="u-bread-btn-group">
          <a @click="searchAll">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </a>
          <router-link :to="{path: '/main/homemap/map-company', query: {areaId: $route.query.areaId, areaType:  $route.query.areaType}}">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div style="height: calc(100% - 61px);display:flex;">
        <div class="u-treecontent" style="height: 100%;" v-if="isShowLeftBannel">
          <ul class="u-subnavbar">
            <li>
              <router-link to="/basic-information/query-manage/query-courtyard-list/roomnum">
                <a>按院落查询</a>
              </router-link>
            </li>
            <li class="c2">
              <a>按使用单位查询</a>
            </li>
          </ul>
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入使用单位" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree lazy :load="loadNode" class="filter-tree" :accordion="true" @node-click="updateorganName" :highlight-current="true" :data="roomNoteList" node-key="value" :default-expanded-keys="[organId]" :props="defaultProps" :filter-node-method="filterNode" ref="tree2" :render-content="renderContent">
            </el-tree>
          </div>
        </div>
        <div style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link :to="{path: '/basic-information/query-manage/query-company-list/addressnum', query: {organId: $route.query.organId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name=" addressnum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="单位地址是指分配给该单位使用且地理位置上不是同一个院落的数量" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryaddress">
                      <img v-if="iconShowlist[0]" :src="$store.state.imgPath.queryaddressh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>单位地址</p>
                      <h2 class="u-query-h2">{{organAddressNum}}处</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :to="{path: '/basic-information/query-manage/query-company-list/realnum', query: {organId: $route.query.organId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="realnum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="实际人数是指当前查询条件下系统内属于本单位的人员数量，
                  包括编制内人员、借调人员、外聘人员等。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.querypeople">
                      <img v-if="iconShowlist[1]" :src="$store.state.imgPath.querypeopleh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>实际人数</p>
                      <h2 class="u-query-h2">{{realPersonNum}}人</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>

            <el-col :span="8">
              <!-- <router-link :to="{path: '/basic-information/query-manage/query-company-list/repairtimes', query: {organId: $route.query.organId,areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="repairtimes"> -->
              <div class="grid-content u-grid-content f-relative f-clearfix">
                <el-tooltip class="item u-grid-tips" effect="dark" content="房屋维修次数是指当前查询条件下本单位发生的维修次数，默认为当前年度，可跨越多个年份进行查询汇总。" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
                <el-col :span="10">
                  <div class="u-query-icons">
                    <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.queryrepair">
                    <img v-if="iconShowlist[2]" :src="$store.state.imgPath.queryrepairh">
                  </div>
                </el-col>
                <el-col :span="14">
                  <div class="u-query-txt">
                    <p>房屋维修次数</p>
                    <h2 class="u-query-h2">{{houseRepairNum}}次</h2>
                  </div>
                </el-col>
              </div>
              <!-- </router-link> -->
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
        label: 'label'
      },
      storeysLabel: '', //楼层名称
      // organId: '',
      organAddressNum: '', //	单位地址数
      realPersonNum: '', //实际人数
      houseRepairNum: '', // 房屋维修次数
      flag: 'area',
      isShowLeftBannel: false
    };
  },
  activated() {
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
    if (this.$route.query.organId) { // 是否是从首页进入
      this.isShowLeftBannel = false;
      this.organName = this.$route.query.organName;
      this.$store.dispatch('organIdActions', this.$route.query.organId);
      this.getCompanydata();
    } else {
      this.isShowLeftBannel = true;
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
    token() {
      return this.$store.state.mainData.token
    },
    areaLevel() {
      return this.$store.state.mainData.areaLevel
    }
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree2.filter(val);
    },
    'areaId': function (val) {
      this.getRoomTree();
    },
    'organId': function (value) {
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
    renderContent(h, { node, data, store }) {
      if (node.level == 5 && this.areaLevel === 3) {
        return (
          <span>
            <span>{node.label}</span>
            <span>层</span>
          </span>
        );
      } else if (node.level == 4 && this.areaLevel != 3) {
        return (
          <span>
            <span>{node.label}层</span>
          </span>
        );
      } else {
        return (
          <span>
            <span>{node.label}</span>
          </span>
        );
      }
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
      let params = {
        id: this.areaId,
        level: this.areaLevel,
        flag: this.flag
      }
      this.$axiosPost(API.organSearch_getOrganTree, params).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            this.$set(item, 'children', [{
              value: item.value + 1,
              label: item.label
            }])
          })
          this.roomNoteList = res.data;
          if (this.$route.query.formPage == 'courtyardOrgan') {
            for (let i = 0, j = this.roomNoteList.length; i < j; i++) {
              if (this.organId == this.roomNoteList[i].value) {
                this.organName = this.roomNoteList[i].label;
              }
            }
          } else {
            if (res.data.length === 0) {
              this.$store.dispatch('organIdActions', '');
            } else {
              this.$store.dispatch('organIdActions', res.data[0].value);
              this.organName = res.data[0].label;
            }
          }
          this.$nextTick(() => {
            if (this.$route.query.formPage == 'courtyardOrgan') {
              this.$refs.tree2.setCurrentKey(this.organId)
            } else {
              this.$refs.tree2.setCurrentKey(res.data[0].value)
            }
          });
          this.getCompanydata();
        } else {
          this.roomNoteList = [];
        }
      })
    },
    loadNode(node, resolve) {
      if (node.data.typeFlag === 'organ') {
        this.$store.dispatch('organIdActions', node.data.value);
      }
      let params = {
        id: node.data.value,
        level: this.areaLevel,
        flag: node.data.typeFlag
      }
      if (node.data.typeFlag === 'courtyard' || node.data.typeFlag === 'floor' || node.data.typeFlag === 'storeys') {
        this.$set(params, 'organId', this.organId)
      }
      this.$axiosPost(API.organSearch_getOrganTree, params).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve([]);
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
      if (data.typeFlag === 'organ') {
        this.$store.dispatch('organIdActions', data.value);
        this.organName = data.label;
        this.getCompanydata();
      }
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
  padding: 25px 0;
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
    font-size: 38px;
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
    color: #303133;
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
