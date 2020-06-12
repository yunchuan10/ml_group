<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="综合查询" :item="['综合查询']" type="2"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size">{{organName || ''}}
          <!-- <span class="f-weight-normal" v-show="courtyardAddress? true:false">({{courtyardAddress}})</span> -->
        </div>
        <div class="u-bread-btn-group">
          <router-link to="/operate/query-manage/query-courtyard-list/roomnum">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </router-link>
          <router-link :to="{path: '/operate/homemap/map-courtyard', query: {areaId: $route.query.areaId,name:this.name}}">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div style="height: calc(100% - 61px);display:flex">
        <div class="u-treecontent" style="height: 100%;" v-if="isShowLeftBannel">          
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入单位名称" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree class="filter-tree" @node-click="updateCourtyardName" :highlight-current="true" node-key="organId" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2" >
            </el-tree>
          </div>
        </div>
        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link :class="iconShowlist[0]?'router-link-exact-active router-link-active':''" :to="{path: '/operate/query-manage/query-courtyard-list/roomnum', query: {organId: $route.query.organId, organName: $route.query.organName}}" name="roomNum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="包括出租中和闲置状态的所有房屋。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.house_num">
                      <img v-if="iconShowlist[0]" :src="$store.state.imgPath.house_numh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>房屋总数量</p>
                      <h2 class="u-query-h2">{{houseNum?houseNum:'0'}}处</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :class="iconShowlist[1]?'router-link-exact-active router-link-active':''" :to="{path: '/operate/query-manage/query-courtyard-list/companynum', query: {organId: $route.query.organId, organName: $route.query.organName}}" name="companyNum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="包括执行中、已结束和已解除合同。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.contract_num">
                      <img v-if="iconShowlist[1]" :src="$store.state.imgPath.contract_numh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>合同总数量</p>
                      <h2 class="u-query-h2">{{contractNum?contractNum:'0'}}份</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>

            <el-col :span="8">
              <router-link :class="iconShowlist[2]?'router-link-exact-active router-link-active':''" :to="{path: '/operate/query-manage/query-courtyard-list/registernum', query: {organId: $route.query.organId, organName: $route.query.organName}}" name="registerNum">
                <div @click="changeImg(2)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="包括逾期未入账租金、即将到期租金和已入账租金。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.accounting_rent">
                      <img v-if="iconShowlist[2]" :src="$store.state.imgPath.accounting_renth">

                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>租金总金额</p>
                      <h2 class="u-query-h2" :title="rentNum">{{rentNum | ellipsis}}元</h2>
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
    <!-- 操作成功提示框 -->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt>
  </div>
</template>

<script>
export default {
  filters: {
    ellipsis(value) {
      if (!value) return '0'
      if (value.length > 8) {
        return value.slice(0, 8) + '...'
      }
      return value
    }
  },
  data() {
    return {
      YPromptShow: false,
      isBol: false,
      message: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      name: '',
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      activeName: 'number',
      filterText: '',
      list: [], //表格列表信息
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      organId: '', // 单位id
      organName: '', //单位名称
      courtyardName: '', //院落名称
      courtyardAddress: '', //院落地址
      id: '',//楼层id
      houseNum: '', //房屋总计
      rentNum: '', // 租金总计
      contractNum: '', //合同总计
      isShowLeftBannel: true,
      flag: 'area'
    };
  },
  activated() {
    if (this.$route.query.organId && this.$route.query.organName) {
      this.isShowLeftBannel = false;
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.name = this.$route.query.name;
      this.$store.dispatch('operateOrganIdActions', this.$route.query.organId);  //经营性房产 综合查询按单位id
      this.getYardata();
    } else {
      this.name = '';
      this.isShowLeftBannel = true;
      this.getRoomTree();
      this.$store.dispatch('operateOrganIdActions', '');
    }
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
  },
  deactivated() {
    this.iconShowlist = [true, false, false];
    this.filterText = '';
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },
  mounted() {
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    token() {
      return this.$store.state.mainData.token
    },
    areaLevel() {
      return this.$store.state.mainData.areaLevel
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree2.filter(val);
    },
    'areaId': function (val) {
      this.getRoomTree();
    },
    '$route.query.organId': function (value) {
      if (!value) {
        this.isShowLeftBannel = true;
        this.getRoomTree();
        this.$store.dispatch('operateOrganIdActions', '');
      }
    }
  },
  methods: {
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
        organId:this.loginOrganId
      }
      this.$axiosGet(API.comprehensive_getOrganListByRequest, params).then(res => {
        if (res.data.length > 0) {
          // res.data.forEach((item, index) => {
          //   this.$set(item, 'children', [{
          //     value: item.value + 1,
          //     label: item.label
          //   }])
          // })
          this.roomNoteList = res.data;
          this.organId = res.data[0].organId;
          this.organName = res.data[0].label;
          this.$nextTick(() => {
            this.$refs.tree2.setCurrentKey(res.data[0].organId)
          });
          this.getYardata();
        } else {
          this.organId = '';
          this.roomNoteList = [];
        }
      })
    },
    //获取房屋、合同、租金总计
    getYardata() {
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.comprehensive_getTotalData, params).then(res => {
        if (res.data) {
          this.houseNum = res.data.totalHouseNum || '0';  //房屋总数量
          this.contractNum = res.data.totalContractNum || '0';  //合同总数量
          this.rentNum = res.data.totalRentNum || '0';  //租金总数量
        } else {
          this.houseNum = '0';
          this.contractNum = '0';
          this.rentNum = '0';
        }
        this.$store.dispatch('operateOrganIdActions', this.organId);
      })
    },
    // loadNode(node, resolve) {
    //   let params = {
    //     id: node.data.value
    //   }
    //   this.$axiosPost(API.comprehensive_getOrganListByRequest, params).then(res => {
    //     if (res.data) {
    //       resolve(res.data);
    //     } else {
    //       resolve([]);
    //     }
    //   })
    // },
    updateCourtyardName(data) {
      this.organId = data.organId;
      this.courtyardName = data.label;
      this.getYardata();
    
    }
  },

};
</script>
<style  lang="scss">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
// .el-tree-node__expand-icon {
//   display: none;
// }
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
    font-size: 28px;
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
