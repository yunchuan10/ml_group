<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size">{{organName || '按使用单位查询'}}</div>
        <!-- <div class="f-pull-left f-weight-bold f-size">{{organName}}</div> -->
        <!-- <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn"> 全景模式</button>
          <button class="f-pull-right u-bread-btn">3D模式</button>
        </div> -->
      </div>
      <div style="height: calc(100% - 61px)">
        <div class="u-treecontent" style="height: 100%;">
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入使用单位" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree lazy :load="loadNode" class="filter-tree" :accordion="true" @node-click="updateorganName" :highlight-current="true" :data="roomNoteList" node-key="value" :default-expanded-keys="[courtyardId]" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
            </el-tree>
          </div>
        </div>
        <div class="u-left" style="height: 100%;overflow: auto;">
          <el-row :gutter="20">
            <el-col :span="8">
              <router-link to='/query-manage/query-company-list/addressnum' name="addressnum">
                <div @click="changeImg(0)" class="grid-content u-grid-content f-relative f-clearfix">
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
              <router-link to='/query-manage/query-company-list/realnum' name="realnum">
                <div @click="changeImg(1)" class="grid-content u-grid-content f-relative f-clearfix">
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
import paths from '@/utils/baseUrl'; // 后端地址

export default {
  data() {
    return {
      path: [],
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      filterText: '',
      organName: '', //院落名称
      list: [], //表格列表信息
      organList: [], //单位集合
      userId: '', //用户名id
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      organAddressNum: '', //	单位地址数
      realPersonNum: '', //实际人数
      flag: 'area'
    };
  },
  activated() {
    this.getCompanydata();
    this.getRoomTree()
    this.path = paths.path().split(':');
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
  },
  deactivated() {
    this.iconShowlist = [true, false, false];
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    courtyardId() {
      return this.$store.state.mainData.courtyardId
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
    }
  },
  methods: {
    // renderContent(h, { node, data, store }) {
    //   if (node.level == 3) {
    //     return (
    //       <span>
    //         <span>{node.label}</span>
    //         <span>层</span>
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
        flag: this.flag,
        level: this.areaLevel,
        id: this.courtyardId
      }
      this.$axiosPost(API.useSummary_getUseCourtyardTree, params).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            this.$set(item, 'children', [{
              value: item.value + 1,
              label: item.label
            }])
          })
          this.roomNoteList = res.data;
          if (res.data.length == 0) {
            this.$store.dispatch('courtyardIdActions', '');
          } else {
            this.$store.dispatch('courtyardIdActions', res.data[0].value);
            this.organName = res.data[0].label;
            this.$nextTick(() => {
              this.$refs.tree2.setCurrentKey(res.data[0].value)
            });
          }
        }
      })
    },
    loadNode(node, resolve) {
      let params = {
        id: node.data.value,
        level: this.areaLevel,
        flag: node.data.typeFlag
      }
      this.$axiosPost(API.useSummary_getUseCourtyardTree, params).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      })
    },
    getCompanydata() {
      this.$axiosPost(API.useSummary_getPublicData, {}).then(res => {
        if (res.result === 'success') {
          this.organAddressNum = res.data.organAddressNum;
          this.realPersonNum = res.data.realPersonNum;
        }
      })
    },
    updateorganName(data) {
      if (data.typeFlag === 'courtyard') {
        this.$store.dispatch('courtyardIdActions', data.value);
        this.organName = data.label;
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
