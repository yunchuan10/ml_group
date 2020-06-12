<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <div class="f-pull-left f-weight-bold f-size">
          <Y-Breadcrumb title="里程碑管理" :item="['里程碑管理']" type="2"></Y-Breadcrumb>
        </div>
        <div class="u-bread-btn-group">
          <router-link to="/operate/milestone-manage/new-milestone">
            <button class="u-bread-btn">新建里程碑</button>
          </router-link>
        </div>

        <div class="u-bread-btn-group">
          <router-link to="/operate/query-manage/query-courtyard-list/roomnum">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </router-link>
          <router-link :to="{path: '/operate/homemap/map-courtyard', query: {areaId: $route.query.areaId, areaType:  $route.query.areaType}}">
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
            <el-tree lazy :load="loadNode" class="filter-tree" @node-click="updateCourtyardName" :highlight-current="true" node-key="value" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2">
            </el-tree>
          </div>
        </div>
        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">

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
    if (this.$route.query.organId) {
      this.isShowLeftBannel = false;
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.getYardata();
    } else {
      this.isShowLeftBannel = true;
      this.getRoomTree();
    }

  },
  deactivated() {
    this.filterText = '';
  },
  mounted() {
  },
  computed: {
    // areaId() {
    //   return this.$store.state.mainData.areaId
    // },
    // token() {
    //   return this.$store.state.mainData.token
    // },
    // areaLevel() {
    //   return this.$store.state.mainData.areaLevel
    // }
  },
  watch: {
    // 'filterText': function (val) {
    //   this.$refs.tree2.filter(val);
    // },
    // 'areaId': function (val) {
    //   this.getRoomTree();
    // },
    // '$route.query.organId': function (value) {
    //   if (!value) {
    //     this.isShowLeftBannel = true;
    //     this.getRoomTree();
    //   }
    // }
  },
  methods: {


    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getRoomTree() {
      // let params = {
      // areaId: this.areaId,
      // level: this.areaLevel,
      // flag: this.flag
      // }
      // this.$axiosPost(API, params).then(res => {
      // if (res.data.length > 0) {
      //   res.data.forEach((item, index) => {
      //     this.$set(item, 'children', [{
      //       value: item.value + 1,
      //       label: item.label
      //     }])
      //   })
      //   this.roomNoteList = res.data;
      //   this.organId = res.data[0].value;
      //   this.courtyardName = res.data[0].label;
      //   this.$nextTick(() => {
      //     this.$refs.tree2.setCurrentKey(res.data[0].value)
      //   });
      //   this.getYardata();
      // } else {
      //   this.organId = '';
      //   this.roomNoteList = [];
      // }
      // })
    },

    loadNode(node, resolve) {
      // let params = {
      // id: node.data.value,
      // level: this.areaLevel,
      // flag: node.data.typeFlag
      // }
      // this.$axiosPost(API, params).then(res => {
      // if (res.data) {
      //   resolve(res.data);
      // } else {
      //   resolve([]);
      // }
      // })
    },
    updateCourtyardName(data) {
      // if (data.typeFlag === 'organ') {
      //   this.organId = data.value;
      //   this.courtyardName = data.label;
      //   this.getYardata();
      // }
     
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
