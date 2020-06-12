<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>

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
                  <span>日期</span>
                  <el-date-picker v-model="defaultTime" type="date" placeholder="请选择日期" :picker-options='pickerOptions0'>
                  </el-date-picker>
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
        <h2 class="u-table-title">{{showDate}} {{areaName}}经营性房产租赁信息统计表</h2>
        <!-- <div class="f-pull-right f-absolute el-radio-style">
          <el-radio-group v-model="activeName" @change="getClick" style="margin-bottom: 30px;" size="small">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group>
        </div>
        <div class="f-clearfix"></div>
        <div id="main" style="width: 100%;height:415px;">
        </div> -->
        <el-table :data="list" stripe style="width: 100%" show-summary>
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="60">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="areaName" label="单位名称" width="170">
            <template slot-scope="scope">
              <router-link v-if="scope.row.areaType == 1" :to="{path:'/operate/overall-statistical/overall-company-list',query:{areaId:scope.row.areaId,areaType:scope.row.areaType,queryTime: pushdate,areaName: scope.row.areaName}}">{{scope.row.areaName}}</router-link>
              <a v-if="scope.row.areaType == 0" @click="areaDataClick(scope.row.areaId,scope.row.areaName)">{{scope.row.areaName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="totalHouse" label="批复编制人数（人）" width="150">
          </el-table-column>
          <el-table-column prop="totalBuildArea" label="实有人数（人）" width="150">
          </el-table-column>
          <el-table-column prop="rentHouse" label="出租中（处）" width="150">
          </el-table-column>
          <el-table-column prop="rentArea" label="出租面积（㎡）" width="150">
          </el-table-column>
          <el-table-column prop="totalRentMoney" label="总租金（元）" width="150">
          </el-table-column>
          <el-table-column prop="beenBookedRentMoney" label="已入账租金（元）" width="150">
          </el-table-column>
          <el-table-column prop="maturityNotBookedRentMoney" label="逾期租金（元）" width="170">
          </el-table-column>
          <el-table-column prop="notMaturityRentMoney" label="即将到期租金（元）" width="150">
          </el-table-column>
          <el-table-column prop="idleHouse" label="闲置房产（处）" width="150">
          </el-table-column>
          <el-table-column prop="idleArea" label="闲置面积（㎡）" width="150">
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
          <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button>
        </div> -->
        <div class="h-table-pages f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    let self = this;
    let date = new Date() - 24 * 60 * 60 * 1000;
    return {
      activeName: '数量',
      defaultTime: date,
      areaType: '',
      showDate: '',
      pushdate: '',
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合  
      dataHistory: [], //保存的历史数据 
      count: 1,
      datalist: [], //缓存数据
      option: {
        grid: {
          top: 40,
          left: 50,
          bottom: 80,
          right: 20,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 60
        }, {
          start: 50,
          end: 100,
          xAxisIndex: [0],
          // height: 20, //组件高度
          right: 30, //右边的距离
          bottom: 5, //右边的距离
          handleSize: '80%'
        }],
        legend: {
          data: ['办公室', '服务用房', '设备用房', '附属用房', '技术业务用房', '空置房间'],
        },
        toolbox: {
          show: true,
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value㎡',
            name: '面积'
          }
        ],
        color: ['#4b7efe', '#fec400', '#29cc97', '#ff704f', '#9f4ef1', '#ff5560'],
        series: [
          {
            name: '办公室',
            type: 'bar',
            data: [],
          },
          {
            name: '服务用房',
            type: 'bar',
            data: [],
          },
          {
            name: '设备用房',
            type: 'bar',
            data: [],
          },
          {
            name: '附属用房',
            type: 'bar',
            data: [],
          },
          {
            name: '技术业务用房',
            type: 'bar',
            data: [],
          },
          {
            name: '空置房间',
            type: 'bar',
            data: [],
          }
        ]
      },
      pickerOptions0: {
        disabledDate(time) {
          if (time) {
            return time.getTime() > (Date.now() - 24 * 60 * 60 * 1000);
          }
        }
      },
      areaName: ''
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
    // this.queryTime = this.defaultTime;
    this.getDataRequest();
    // this.getDataChart();
    // this.myChart = echarts.init(document.getElementById('main'));
    // this.myChart.setOption(this.option);
  },
  mounted() {
    // this.init();
  },
  computed: {
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
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
      // this.queryTime = this.defaultTime;
    },
    // 地区内容下钻刷新
    areaDataClick(id, areaname) {
      this.areaId = id;
      this.areaName = areaname;
      let data = [];
      this.count++;
      this.dataHistory.push({
        areaId: id,
        areaName: areaname,
        level: this.count
      })
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
    //面积切换
    // getClick() {
    //   this.getDataChart();
    // },
    // 获取列表数据
    getDataRequest() {
      this.pushdate = FORMATGET.formatGET(this.defaultTime)
      let params = {
        areaId: this.areaId,
        areaType: 0, //区域类型
        areaNames: this.areaName,
        queryTime: FORMATGET.formatGET(this.defaultTime), //查询时间  
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.dealstatistical_rentStatisticsAreaList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.list;
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
        if (this.defaultTime) {
          this.showDate = DATEFORMAT.dateReturn(new Date(this.defaultTime));
        } else {
          this.showDate = '';
        }
      });
    },
    // 获取echart图表数据
    // getDataChart() {
    //   this.pushdate = FORMATGET.formatGET(this.defaultTime)
    //   let params = {
    //     areaId: this.areaId,
    //     areaType: 0, //区域类型
    //     areaNames: this.areaName,
    //     queryTime: FORMATGET.formatGET(this.defaultTime), //查询时间  
    //     currentPage: 1,
    //     pageSize: 40
    //   };
    //   this.$axiosPost(API.dealstatistical_rentStatisticsAreaList, params).then(res => {
    //     let list = [];
    //     let areaNameList = [];
    //     let officeNumList = [];
    //     let serviceRoomNumList = [];
    //     let equipmentRoomNumList = [];
    //     let affiliateRoomNumList = [];
    //     let technologyRoomNumList = [];
    //     let vacancyRoomNumList = [];
    //     let vacancyUserAreaList = [];
    //     let officeUserAreaList = [];
    //     let serviceRoomUseAreaList = [];
    //     let equipmentRoomUseAreaList = []; //设备用房面积
    //     let affiliateRoomBuildAreaList = []; // 	附属用房建筑面积
    //     let technologyRoomUseAreaList = []; // 技术用房面积
    //     if (res.data) {
    //       list = res.data.list;
    //     }
    //     if (list) {
    //       list.forEach((item, index) => {
    //         list[index].num = index + 1;
    //         areaNameList.push(item.areaName);
    //         officeNumList.push(item.officeRoomNum);
    //         serviceRoomNumList.push(item.serviceRoomNum);
    //         equipmentRoomNumList.push(item.equipmentRoomNum);
    //         affiliateRoomNumList.push(item.affiliateRoomNum);
    //         technologyRoomNumList.push(item.technologyRoomNum);
    //         vacancyRoomNumList.push(item.vacancyRoomNum);
    //         vacancyUserAreaList.push(item.vacancyUserArea);
    //         officeUserAreaList.push(item.officeUserArea);
    //         serviceRoomUseAreaList.push(item.serviceRoomUseArea);
    //         equipmentRoomUseAreaList.push(item.equipmentRoomUseArea);
    //         affiliateRoomBuildAreaList.push(item.affiliateRoomBuildArea);
    //         technologyRoomUseAreaList.push(item.technologyRoomUseArea);
    //       });
    //     } else {
    //       areaNameList = [];        }
    //     if (this.activeName === '数量') {
    //       this.option.series[0].data = officeNumList || '';
    //       this.option.series[1].data = serviceRoomNumList || '';
    //       this.option.series[2].data = equipmentRoomNumList || '';
    //       this.option.series[3].data = affiliateRoomNumList || '';
    //       this.option.series[4].data = technologyRoomNumList || '';
    //       this.option.series[5].data = vacancyRoomNumList || '';
    //     } else {
    //       this.option.series[0].data = officeUserAreaList || '';
    //       this.option.series[1].data = serviceRoomUseAreaList || '';
    //       this.option.series[2].data = equipmentRoomUseAreaList || '';
    //       this.option.series[3].data = affiliateRoomBuildAreaList || '';
    //       this.option.series[4].data = technologyRoomUseAreaList || '';
    //       this.option.series[5].data = vacancyUserAreaList || '';
    //     }
    //     this.option.xAxis[0].data = areaNameList || '';
    //     // this.myChart.setOption(this.option);
    //     this.showDate = DATEFORMAT.dateReturn(new Date(this.defaultTime));
    //   });
    // },
    exportClick() { // 导出
      // this.pushdate = FORMATGET.formatGET(this.defaultTime)
      let params = {
        areaId: this.areaId,
        areaType: 0, //区域类型
        areaNames: this.areaName,
        queryTime: this.showDate, //查询时间  
        // queryTime: FORMATGET.formatGET(this.queryTime), //查询时间  
        pageNum: this.page,
        pageSize: this.pageSize,
        exportFlag: 'YES'
      };
      this.$axiosPost(API.dealstatistical_rentStatisticsAreaList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })

    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.el-radio-style {
  z-index: 10;
  right: 21px;
  top: 21px;
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
