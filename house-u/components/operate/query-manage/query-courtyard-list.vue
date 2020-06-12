<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size">{{courtyardName || '按院落查询'}}
          <!-- <span class="f-weight-normal" v-show="courtyardAddress? true:false">({{courtyardAddress}})</span> -->
        </div>
        <div class="u-bread-btn-group">
          <a @click="get3DUrl('VIEM')">
            <button class="f-pull-right u-bread-btn">
              全景模式
            </button>
          </a>
          <a @click="get3DUrl('THREE')">
            <button class="f-pull-right u-bread-btn">
              3D模式
            </button>
          </a>
          <router-link to="/basic-information/query-manage/query-courtyard-list/roomnum">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </router-link>
          <router-link :to="{path: '/main/homemap/map-courtyard', query: {areaId: $route.query.areaId, areaType:  $route.query.areaType}}">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div style="height: calc(100% - 61px);display:flex">
        <div class="u-treecontent" style="height: 100%;" v-if="isShowLeftBannel">
          <ul class="u-subnavbar">
            <li class="c1">
              <a>按院落查询</a>
            </li>
            <li>
              <router-link to="/basic-information/query-manage/query-company-list/addressnum">
                <a>按使用单位查询</a>
              </router-link>
            </li>
          </ul>
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入院落名称" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree lazy :load="loadNode" class="filter-tree" @node-click="updateCourtyardName" :highlight-current="true" node-key="value" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2">
            </el-tree>
          </div>
        </div>
        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list/roomnum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="roomNum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="房间总数量是指该院落内所有房间数量，包括办公室、服务用房、附属用房、设备用房以及技术业务用房。
其中，已分配是指分配给各单位使用的房间，闲置是指当前暂未分给任何单位使用的房间。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryroom">
                      <img v-if="iconShowlist[0]" :src="$store.state.imgPath.queryroomh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>房间总数量</p>
                      <h2 class="u-query-h2">{{roomNum?roomNum:'0'}}间</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list/companynum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="companyNum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="使用单位是指使用该院落内办公用房的所有单位" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.querycompany">
                      <img v-if="iconShowlist[1]" :src="$store.state.imgPath.querycompanyh">
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>使用单位</p>
                      <h2 class="u-query-h2">{{useOrganNum?useOrganNum:'0'}}家</h2>
                    </div>
                  </el-col>
                </div>
              </router-link>
            </el-col>

            <el-col :span="8">
              <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list/registernum', query: {courtyardId: $route.query.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType}}" name="registerNum">
                <div @click="changeImg(2)" class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="房屋权属登记数量是指产权单位为机关事务管理局或其他单位，且已办理房屋产权证或土地使用证的数量。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.queryregister">
                      <img v-if="iconShowlist[2]" :src="$store.state.imgPath.queryregisterh">

                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>房屋权属登记</p>
                      <h2 class="u-query-h2">{{ownerNum?ownerNum:'0'}}个</h2>
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
  // components: {
  //   'building-detail': buildingDetail,
  // },
  data() {
    return {
      YPromptShow: false,
      isBol: false,
      message: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
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
      this.isShowLeftBannel = false;
      this.courtyardId = this.$route.query.courtyardId;
      this.courtyardName = this.$route.query.courtyardName;
      this.$store.dispatch('courtyardIdActions', this.$route.query.courtyardId);
      this.getYardata();
    } else {
      this.isShowLeftBannel = true;
      this.getRoomTree();
      this.$store.dispatch('courtyardIdActions', '');
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
    }
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree2.filter(val);
    },
    'areaId': function (val) {
      this.getRoomTree();
    },
    '$route.query.courtyardId': function (value) {
      if (!value) {
        this.isShowLeftBannel = true;
        this.getRoomTree();
        this.$store.dispatch('courtyardIdActions', '');
      }
    }
  },
  methods: {
    get3DUrl(pageName) {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosPost(API.yardSearch_getViewUrl, params).then(res => {
        if (res.result === 'success') {
          this.threeUrl = res.data.threeUrl || '';
          this.viewUrl = res.data.viewUrl || '';
        }
        if (pageName === 'VIEM') {
          if (!this.viewUrl) {
            this.YPromptShow = true;
            this.isBol = false;
            this.message = '该院落没有全景图';
          } else {
            window.open(this.viewUrl);
          }
        } else {
          if (!this.threeUrl) {
            this.YPromptShow = true;
            this.isBol = false;
            this.message = '该院落没有3D图';
          } else {
            this.$store.commit('threeUrlMutations', this.threeUrl)
            window.open(`${window.location.origin}/threeD`);
          }
        }
      })
    },
    // renderContent(h, { node, data, store }) {
    //   if (node.level == 4 && this.areaLevel === 3) {
    //     return (
    //       <span>
    //         <span>{node.label}</span>
    //         <span>层</span>
    //       </span>
    //     );
    //   } else if (node.level == 3 && this.areaLevel != 3) {
    //     return (
    //       <span>
    //         <span>{node.label}层</span>
    //       </span>
    //     );
    //   } else {
    //     return (
    //       <span>
    //         <span>{node.label}</span>
    //       </span>
    //     );
    //   }
    // },
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
      this.$axiosPost(API.yardSearch_yardTreeList, params).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            this.$set(item, 'children', [{
              value: item.value + 1,
              label: item.label
            }])
          })
          this.roomNoteList = res.data;
          if (!res.data) {
            this.courtyardId = '';
          } else {
            this.courtyardId = res.data[0].value;
            this.courtyardName = res.data[0].label;
          }
          this.$nextTick(() => {
            this.$refs.tree2.setCurrentKey(res.data[0].value)
          });
          this.getYardata();
        } else {
          this.roomNoteList = [];
        }
      })
    },
    getYardata() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosPost(API.yardSearch_getYardata, params).then(res => {
        if (res.data) {
          this.roomNum = res.data.roomNum;
          this.useOrganNum = res.data.useOrganNum;
          this.ownerNum = res.data.ownerNum;
        } else {
          this.roomNum = '0';
          this.useOrganNum = '0';
          this.ownerNum = '0';
        }
        this.$store.dispatch('courtyardIdActions', this.courtyardId);
      })
    },
    loadNode(node, resolve) {
      let params = {
        id: node.data.value,
        level: this.areaLevel,
        flag: node.data.typeFlag
      }
      this.$axiosPost(API.yardSearch_yardTreeList, params).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      })
    },
    updateCourtyardName(data) {
      if (data.typeFlag === 'courtyard') {
        this.courtyardId = data.value;
        this.courtyardName = data.label;
        this.courtyardAddress = data.courtyardAddress;
        this.getYardata();
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
