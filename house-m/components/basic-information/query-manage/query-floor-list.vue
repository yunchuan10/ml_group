<template>
  <div>
    <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;">
      <div class="u-query-top f-clearfix f-relative">
        <div class="f-absolute imgUrl"><img v-show="imgurl.length === 0" :src="$store.state.imgPath.queryyl">
          <img v-show="imgurl.length > 0 && imgurl != null" :src="imgurl" width="427" height="300">
        </div>
        <div class="u-query-right">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th>楼座名称</th>
                <td style="min-width:150px;">{{floorName}}
                </td>
                <th>建筑结构</th>
                <td>{{houseStructure}}
                </td>
              </tr>
              <tr>
                <th>总建筑面积</th>
                <td>{{buildArea?buildArea+'㎡':'' }}
                </td>
                <th>总占地面积</th>
                <td>{{landArea?landArea+'㎡':''}}
                </td>
              </tr>
              <tr>
                <th>地上建筑层数</th>
                <td>
                  {{upFloorNumber?upFloorNumber+'层':''}}
                </td>
                <th>地下建筑层数</th>
                <td>
                  {{downFloorNumber?downFloorNumber+'层':''}}
                </td>
              </tr>
              <tr>
                <th>地上面积</th>
                <td>{{upArea?upArea+'㎡': ''}}
                </td>
                <th>地下面积</th>
                <td>{{downArea?downArea+'㎡': ''}}
                </td>
              </tr>
              <tr>
                <th>取得方式</th>
                <td>{{obtainWayName}}
                </td>
                <th>取得日期</th>
                <td>{{obtainDate}}
                </td>
              </tr>
              <tr>
                <th>建造年份</th>
                <td>
                  <span v-show="architecturalDate !=null && architecturalDate.length > 0">{{architecturalDate}}</span>
                </td>
                <th>备注</th>
                <td class="warp">
                  {{remark}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="u-query-top f-relative">
        <h2 class="u-query-title">{{courtyardName}}{{floorName}}—各楼层占用使用情况</h2>
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <th>序号</th>
              <th>楼层</th>
              <th>使用面积（㎡）</th>
              <th>使用单位</th>
            </tr>
            <tr v-for="(item,index) in storeysList" :key="index">
              <td align="center">{{index +1 }}
              </td>
              <td align="center">
               <router-link :to="{path:'/plane/Sketchpad',query:{courtyardId:courtyardId}}" target="_blank"> {{item.storeysName||''}}</router-link>
              </td>
              <td align="center">
                {{item.roomUseAreaSum || '0'}}
              </td>
              <td align="center">
                {{item.organNames || ''}}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
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
      buildArea: '', //总建筑面积
      landArea: '', //总占地面积
      remark: '', //备注
      obtainWayName: '', //取得方式
      obtainDate: '', //取得日期
      floorList: [], //楼座详情集合
      houseStructure: '', //建筑结构
      upFloorNumber: '', //地上建筑楼层 
      downFloorNumber: '', //地下建筑楼层
      upArea: '', //地上面积
      downArea: '', //地下面积
      architecturalDate: '', //建造年份
      storeysName: '', //楼层名称
      userAreaSum: '', //使用面积
      organNames: '', //使用单位
      index: 0,
      imgUrls: [], //图片集合
      imgurl: '',
      storeysList: [], //楼层集合
      list: [], //表格列表信息
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      courtyardId: '', // 院落ID
      courtyardName: '', //院落名称
      courtyardAddress: '', //院落地址
      floorId: '', //楼座id
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
      // this.isShowLeftBannel = false;
      this.courtyardId = this.$route.query.courtyardId;
      // this.courtyardName = this.$route.query.courtyardName;
      this.$store.dispatch('courtyardIdActions', this.$route.query.courtyardId);
    } else {
      // this.isShowLeftBannel = true;
      this.$store.dispatch('courtyardIdActions', '');
    }
    // if (sessionStorage.getItem('iconShowlist')) {
    //   this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    // }
    if (this.$route.query.id) {
      this.floorId = this.$route.query.id;
    }
    if (this.$route.query.name) {
      this.$store.dispatch('floorNameActions', this.$route.query.name);
    }
    this.getFloorDetail()
  },
  deactivated() {
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.tree2.setCurrentKey(this.$route.query.id)
    // });
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    floorName() {
      return this.$store.state.mainData.floorName
    },
    token() {
      return this.$store.state.mainData.token
    },

  },
  watch: {
    '$route.query.courtyardId': function (value) {
      if (!value) {
        this.isShowLeftBannel = true;
        this.$store.dispatch('courtyardIdActions', '');
      }
    },
    '$route.query.id': function (value) {
      if (value) {
        this.floorId = this.$route.query.id;
      }
      this.$nextTick(() => {
        this.getFloorDetail()
      });
    }
  },
  methods: {
    getFloorDetail() {
      let params = {
        floorId: this.floorId,
      }
      this.$axiosGet(API.yardSearch2_floorDetail, params).then(res => {
        if (res.data) {
          this.floorList = res.data.floorDetail;
          this.courtyardName = this.floorList.courtyardName;
          if (res.data.floorDetail.obtainDate) {
            this.obtainDate = res.data.floorDetail.obtainDate.substr(0, 10);
          } else {
            this.obtainDate = ''
          }

          this.houseStructure = this.floorList.houseStructure;
          this.architecturalDate = this.floorList.architecturalDate;
          this.upFloorNumber = this.floorList.upFloorNumber;
          this.downFloorNumber = this.floorList.downFloorNumber;
          this.upArea = this.floorList.upArea || '';
          this.downArea = this.floorList.downArea || '';
          this.obtainWayName = this.floorList.obtainWayName || '';
          this.remark = this.floorList.remark || '';
          this.buildArea = this.floorList.buildArea || '';
          this.landArea = this.floorList.landArea || '';
          this.imgUrls = this.floorList.fileResponseList;
          if (this.imgUrls.length > 0) {
            this.imgUrls.forEach((item, index) => {
              if (index === 0) {
                this.imgurl = item.url;
              }
            })
          } else {
            this.imgurl = '';
          }
          this.storeysList = res.data.storeysList;
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

  },

};
</script>

<style lang="scss" scoped>
.h-tab-content {
  .h-table-info tr td {
    word-break: normal;
  }
}

.f-size {
  font-size: 16px;
}
// .warp{
//   word-break: normal !important}
.u-bread {
  height: 30px;
  line-height: 30px;
}
.imgUrl {
  // margin-top: 5px;
  img {
    width: 427px;
    height: 300px;
  }
}
.h-tab-content {
  margin-top: 0;
}
.u-query-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}
.u-query-top {
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #e4e7eb;
  -webkit-box-shadow: 2px 2px 5px #d7d7d7;
  box-shadow: 2px 2px 5px #d7d7d7;
  .u-query-right {
    margin-left: 440px;
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
    text-align: center;
    margin-top: 10px;
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
