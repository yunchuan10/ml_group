<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <!-- <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb> -->
        <div class="f-pull-left f-weight-bold f-size" v-show='courtyardName != "undefined"'>{{`${courtyardName}` || '' }}
          <span v-show="floorName.length >0">
            <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
          </span>{{`${floorName}`}}
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
         <router-link  :to="{path:'/plane/Sketchpad',query:{courtyardId:courtyardId}}" target="_blank">            
            <button class="f-pull-right u-bread-btn">
              平面图模式
            </button>
            </router-link>
          <router-link to="/basic-information/query-manage/query-courtyard-list/query-courtyard">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              查询全部
            </button>
          </router-link>
          <router-link :to="{path: '/home', query: {areaId: $route.query.areaId, courtyardName:  $route.query.courtyardName, name: this.name}}">
            <button class="f-pull-right u-bread-btn" v-if="!isShowLeftBannel">
              返回
            </button>
          </router-link>
        </div>
        <!-- <div class="f-pull-left f-weight-bold f-size">{{`${courtyardName}`}} </div> -->
      </div>
      <div style="height: calc(100% - 61px);display:flex">
        <div class="u-treecontent" style="height: 100%;" v-if="isShowLeftBannel">
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入院落名称" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">
            <el-tree v-if="this.$route.query.id != ''"  class="filter-tree"  @node-expand="updateCourtyardName" :highlight-current="true" node-key="value" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2">
               <span class="custom-tree-node" v-if="!data.userId" slot-scope="{ node, data }">
                 <span @click="updateCourtyardName(data)">{{ node.label }}</span>
               </span>
            </el-tree>
            <el-tree v-if="this.$route.query.id === ''"  class="filter-tree" :default-checked-keys='resourceCheckedKey' @node-expand="updateCourtyardName" :highlight-current="true" node-key="value" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2">
                 <span class="custom-tree-node" v-if="!data.userId" slot-scope="{ node, data }">
                 <span @click="updateCourtyardName(data)">{{ node.label }}</span>
               </span>
            </el-tree>           
          </div>
        </div>
        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <keep-alive>
            <router-view v-if="isRouterActive">
            </router-view>
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
      filterText: '',
      list: [], //表格列表信息
      roomNoteList: [],
      name: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      resourceCheckedKey: [],
      courtyardId: '', // 院落ID
      courtyardName: '', //院落名称
      courtyardAddress: '', //院落地址
      id: '',//楼层id
      roomNum: '',
      threeUrl: '',
      viewUrl: '',
      isShowLeftBannel: true,
      flag: 'area'
    };
  },
  activated() {
    if (this.$route.query.courtyardId && this.$route.query.courtyardName) {
      this.isShowLeftBannel = false;
      this.courtyardId = this.$route.query.courtyardId;
      this.courtyardName = this.$route.query.courtyardName;
      this.name = this.$route.query.name;
      this.$store.dispatch('courtyardIdActions', this.courtyardId);
    } else {
      this.isShowLeftBannel = true;
      this.getRoomTree();
      if (this.$route.path != '/basic-information/query-manage/query-courtyard-list/query-courtyard') {
        this.reload()
      }
      this.$store.dispatch('floorNameActions', '');
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
    floorName() {
      return this.$store.state.mainData.floorName
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
        this.getRoomTree()
      }
    }
  },
  methods: {
    //3D和全景图
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
            this.message = '当前院落暂无全景模式，请致电中科美络技术支持进行定制开发';
          } else {
            window.open(this.viewUrl);
          }
        } else {
          if (!this.threeUrl) {
            this.YPromptShow = true;
            this.isBol = false;
            this.message = '当前院落暂无3D模式，请致电中科美络技术支持进行定制开发';
          } else {
            this.$store.commit('threeUrlMutations', this.threeUrl)
            window.open(`${window.location.origin}/threeD`);
          }
        }
      })
    },
    renderContent(h, { node, data, store }) {
      if (node.level == 4 && this.areaLevel === 3) {
        return (
          <span>
            <span>{node.label}</span>
            <span>层</span>
          </span>
        );
      } else if (node.level == 3 && this.areaLevel != 3) {
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
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
        this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list/query-courtyard/roomnum' })
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
    },
    filterNode(value, data) {
      let res = false;
      if(!value) {
        res = true;
      }else if( data.label && data.label.indexOf && data.label.indexOf(value) !== -1 ){
        res = true;
      }
      return res;
      // if (!value) return true;
      // return data.label.indexOf(value) !== -1;
    },
    getRoomTree() {
      let params = {
        id: this.areaId,
        flag: this.flag,
        username: this.$store.state.mainData.realName,
        password: this.$store.state.mainData.token,
        name: this.$store.state.mainData.organName
      }

      this.$axiosGet(API.yardSearch2_yardTreeList, params).then(res => {
        if (res.data) {
          // res.data.forEach((item, index) => {
          //   this.$set(item, 'children', [{
          //     value: item.value + 1,
          //     label: item.label
          //   }])
          // })
          this.roomNoteList = res.data;
          if (!res.data) {
            this.courtyardId = '';
          } else {
            this.courtyardId = res.data[0].value;
            this.courtyardName = res.data[0].label;
            this.$store.dispatch('courtyardIdActions', this.courtyardId);
          }
          this.$nextTick(() => {
            this.$refs.tree2.setCurrentKey(res.data[0].value)
          });
        } else {
          this.roomNoteList = [];
        }
      })
    },
    loadNode(node, resolve) {

      let params = {
        id: node.data.value,
        flag: node.data.typeFlag,
        username: this.$store.state.mainData.realName,
        password: this.$store.state.mainData.token,
        name: this.$store.state.mainData.organName
      }

      this.$axiosGet(API.yardSearch2_yardTreeList, params).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            if (item.leaf) {
              this.leaf = true;
            }
            resolve(res.data);
          })
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
        this.$store.dispatch('courtyardIdActions', this.courtyardId);
        // this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list/query-courtyard', query: { courtyardId: data.value, courtyardName: data.label } })
        this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list/query-courtyard', query: { courtyardId: this.courtyardId } })
        this.$store.dispatch('floorNameActions', '');
      }
      if (data.typeFlag === 'floor') {
        this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list/floor', query: { id: data.value, courtyardId: this.courtyardId, name: data.label } })
        this.$store.dispatch('floorNameActions', data.label);
        this.courtyardName = '';
      }
      if (data.typeFlag === 'storeys') {
        if (data.value) {
          // this.$router.push({path:'/plane/Sketchpad',query:{courtyardId:this.courtyardId,storeyId:data.value}})
          let routeData = this.$router.resolve({
            path: "/plane/Sketchpad",
            query: {
              courtyardId:this.courtyardId             
            }
          });
          window.open(routeData.href, '_blank');
        }
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
  color: #606266;
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
