<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="闲置情况统计" :item="['闲置情况统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="goBack" v-show="dataHistory.length === 0 ? false: true">
            返回
          </button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>院落名称</span>
                  <el-input v-model="courtyard" clearable placeholder="请输入院落名称"></el-input>
                  <span style="margin-left: 10px;">院落地址</span>
                  <el-input v-model="address" clearable placeholder="请输入院落地址"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">{{areaName}}省直机关办公用房闲置情况统计表</h2>
        <!-- <div class="f-pull-right f-absolute el-radio-style">
          <el-radio-group v-model="activeName" @change="getClick" style="margin-bottom: 30px;" size="small">
            <el-radio-button label="数量">核定面积</el-radio-button>
            <el-radio-button label="面积">实际面积</el-radio-button>
          </el-radio-group>
        </div>
        <div id="main" style="width: 100%;height:415px;">
        </div> -->
        <el-table :data="list" stripe style="width: 100%" @sort-change="getSort">
          <el-table-column prop="date" fixed="left" type="index" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="courtyardName" label="院落名称">

          </el-table-column>
          <el-table-column prop="courtyardAddress" label="院落地址">
          </el-table-column>
          <!-- <el-table-column prop="roomTotal" label="总房间数量（间）">
          </el-table-column> -->

          <el-table-column prop="totalBuildArea" label="楼宇总建筑面积（㎡）">
          </el-table-column>
          <!-- <el-table-column prop="idleRoomNum" label="闲置房间数量（间）">
          </el-table-column> -->
          <el-table-column prop="idleBuildArea" sortable='buildArea' label="闲置建筑面积（㎡）">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/idle-statistical/idle-courtyard-list',query:{courtyardId:scope.row.courtyardId,courtyardName: scope.row.courtyardName}}">{{scope.row.idleBuildArea}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="idleRates" label="闲置率（%）" :render-header="renderHeader">
          </el-table-column>
        </el-table>
        <div class="remark">说明：闲置用房是指各地区各院落内目前没有单位在使用的房间</div>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <floor-detail ref="floorDetail"></floor-detail>
    <floor-batch-add ref="floorBatchadd" @requestData="getDataRequest"></floor-batch-add>
  </div>
</template>

<script>
import floorDetail from '@/components/basic-information/floor-manage/floor-detail'; // 详情弹出框
import floorBatchadd from '@/components/basic-information/floor-manage/floor-batch-add'; // 批量新增弹出框
import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
export default {
  components: {
    'floor-detail': floorDetail,
    'floor-batch-add': floorBatchadd,
    "v-vuePopupPicture": vuePopupPicture
  },
  data() {
    let date = new Date() - 24 * 60 * 60 * 1000;
    return {
      activeName: '数量', //
      // defaultTime: date,
      courtyard: '',
      address: '',
      pushdate: '',
      areaName: '',
      num: 0,
      sortClickNum: '',
      twoClickNum: '',
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      dataHistory: [], //缓存数据
      // option: {
      //   grid: {
      //     top: 40,
      //     left: 50,
      //     right: 20,
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'shadow',
      //         label: {
      //           show: true,
      //           formatter: function (params) {
      //             return params.value.replace('\n', '');
      //           }
      //         }
      //       }
      //     }
      //   },
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   legend: {
      //     data: ['核定面积', '实际面积'],
      //   },
      //   toolbox: {
      //     show: true,
      //   },
      //   calculable: true,
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: []
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value'
      //     }
      //   ],
      //   dataZoom: [{
      //     type: 'inside',
      //     start: 0,
      //     end: 60
      //   }, {
      //     start: 50,
      //     end: 100,
      //     xAxisIndex: [0],
      //     // height: 20, //组件高度
      //     right: 30, //右边的距离
      //     bottom: 5, //右边的距离
      //     handleSize: '80%'
      //   }],
      //   color: ['#4b7efe', '#fec400'],
      //   series: [
      //     {
      //       name: '核定面积',
      //       type: 'bar',
      //       data: [],
      //     },
      //     {
      //       name: '实际面积',
      //       type: 'bar',
      //       data: [],
      //     }
      //   ]
      // },
      // pickerOptions0: {
      //   disabledDate(time) {
      //     if (time) {
      //       return time.getTime() > (Date.now() - 24 * 60 * 60 * 1000);
      //     }
      //   }
      // },
    };
  },
  activated() {
    if (this.$route.query.areaId) {
      if (this.dataHistory.length == 2) {
        this.areaId = this.dataHistory[1].areaId;
      } else {
        this.areaId = this.$route.query.areaId;
      }
    } else {
      this.areaName = this.$store.state.mainData.areaName;
      this.areaId = this.$store.state.mainData.areaId;
    }
    this.courtyard = '';
    this.address = '';
    this.getDataRequest();
    // this.getDataChart();
    // this.init();
    // this.myChart = echarts.init(document.getElementById('main'));
    // this.myChart.setOption(this.option);
  },
  mounted() {

  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },
  },

  methods: {
    // 图表大小自适应
    // init() {
    //   setTimeout(() => {
    //     window.onresize = () => {
    //       this.myChart.resize();
    //     };
    //   }, 500);
    // },
    renderHeader(h, { column }) {
      return h(
        'div',
        [
          h('span', column.label),
          h('el-tooltip', {
            props: {
              effect: 'dark',
              content: '闲置面积/楼宇总建筑面积；',
              placement: 'top',
            },
          }, [
            h('i', {
              class: 'el-icon-info',
              style: 'margin-left:5px;'
            })
          ], {
          })
        ]
      );
    },
    //排序
    getSort(param) {
      if (param.column && param.column.sortable == "buildArea") {
        if (param.order === 'ascending') {
          this.sortClickNum = 'ASC';
        } else if (param.order === 'descending') {
          this.sortClickNum = 'DESC';
        } else {
          this.sortClickNum = '';
        }
      } else if (param.column && param.column.sortable == "rates") {
        if (param.order === 'ascending') {
          this.twoClickNum = 'ASC';
        } else if (param.order === 'descending') {
          this.twoClickNum = 'DESC';
        } else {
          this.towClickNum = '';
        }
      }
      this.getDataRequest();
    },

    //返回
    goBack() {
      if (this.dataHistory.length == 2) {
        this.areaId = this.dataHistory[0].areaId;
        this.areaName = this.dataHistory[0].areaName;
        this.getDataRequest(this.areaId, this.areaName);
        this.dataHistory.pop();
      } else {
        this.dataHistory = [];
        this.areaName = this.$store.state.mainData.areaName;
        this.areaId = this.$store.state.mainData.areaId;
        this.getDataRequest(this.areaId, this.areaName)
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        idleAreaSort: this.sortClickNum || '',
        courtyardName: this.courtyard || '',
        courtyardAddress: this.address || '',
        organId: this.loginOrganId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.idle_execIdleCourtyardList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.sortClickNum = '';
        this.twoClickNum = ''
      });
    },
    // 获取列表数据
    // exportClick() {
    //   // this.pushdate = FORMATGET.formatGET(this.defaultTime)
    //   let params = {
    //     areaId: this.areaId,
    //     areaName: this.areaName,
    //     areaType: 0,
    //     queryTime: this.pushdate,
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_idleStatisticsAreaList, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   });
    // },

    // 获取echart图表数据
    // getDataChart() {
    //   // this.pushdate = FORMATGET.formatGET(this.defaultTime)
    //   let params = {
    //     areaId: this.areaId,
    //     areaType: 0,
    //     queryTime: this.pushdate,
    //     currentPage: 1,
    //     pageSize: 40
    //   };
    //   this.$axiosPost(API.aggregateUsage_idleStatisticsAreaList, params).then(res => {
    //     let list = [];
    //     if (res.data) {
    //       list = res.data.list;
    //     }
    //     let areaNameList = [];
    //     let idleAllNumList = [];
    //     let idleRoomNumList = [];
    //     let idleAllareaList = [];
    //     let idleRoomareaList = [];
    //     if (list) {
    //       list.forEach((item, index) => {
    //         areaNameList.push(item.areaName);
    //         idleAllNumList.push(item.roomTotal);
    //         idleRoomNumList.push(item.idleRoomNum);
    //         idleAllareaList.push(item.totalUseArea);
    //         idleRoomareaList.push(item.idleUseArea)
    //       })
    //     } else {
    //       areaNameList = '';
    //       idleAllNumList = '';
    //       idleRoomNumList = '';
    //       idleAllareaList = '';
    //       idleRoomareaList = '';
    //     }
    // this.option.xAxis[0].data = areaNameList || '';
    // if (this.activeName == '数量') {
    //   this.option.legend.data = ['房间总数量', '闲置房间数量'];
    //   this.option.series[0].name = '房间总数量';
    //   this.option.series[1].name = '闲置房间数量';
    //   this.option.series[0].data = idleAllNumList || '';
    //   this.option.series[1].data = idleRoomNumList || '';
    // } else {
    //   this.option.legend.data = ['房间总面积', '闲置房间面积'];
    //   this.option.series[0].name = '房间总面积';
    //   this.option.series[1].name = '闲置房间面积';
    //   this.option.series[0].data = idleAllareaList || '';
    //   this.option.series[1].data = idleRoomareaList || '';
    // }
    // this.myChart.setOption(this.option);
    //   });
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.el-radio-style {
  right: 21px;
  top: 21px;
  z-index: 10;
}
.remark {
  margin-top: 10px;
  font-size: 12px;
}
.main-default {
  .g-content {
    .m-main {
      .g-main {
        .h-table {
          .el-table thead th {
            .cell {
              border-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
