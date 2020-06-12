<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标情况统计" :item="['超标情况统计']" type="1"></Y-Breadcrumb>
      </div>

      <div class="h-table f-relative">
        <h2 class="u-table-title">{{areaName}}省直机关各单位超标情况统计表</h2>
        <div class="f-clearfix"></div>
        <div id="main" style="width: 100%;height:415px;">
        </div>
        <div class="m-search" style="margin-bottom: 15px">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                  <li>
                    <span>单位名称</span>
                    <el-select v-model="company" filterable clearable placeholder="请选择单位名称">
                      <el-option v-for="item in organNameSelectList" :key="item.organId" :label="item.organName" :value="item.organName">
                      </el-option>
                    </el-select>
                  </li>
                  <li>
                    <span>单位所在层级</span>
                    <el-select v-model="organLeve" filterable clearable placeholder="请选择单位名称">
                      <el-option v-for="(item, index ) in organNameLevelList" :key="index" :label="item+'级'" :value="item">
                      </el-option>
                    </el-select>
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
        <el-table :data="list" stripe style="width: 100% ,margin-top:15px" show-summary :summary-method=" getSummaries" @sort-change="getSort">
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="单位名称" fixed="left" width="100">
          </el-table-column>
          <el-table-column label="办公室" style="text-align:canter;">
            <el-table-column prop="officeCheckArea" label="核定使用面积上限(㎡)" width="170">
            </el-table-column>
            <el-table-column prop="officeRealUseArea" label="实际使用面积(㎡)" width="140">
            </el-table-column>
            <el-table-column prop="officeExcessiveArea" label="超标面积(㎡)" width="130" :render-header="renderHeader">
            </el-table-column>
            <el-table-column prop="officeExcessivePersonNum" label="超标人数(人)" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-person-list',query:{organName: scope.row.organName,organId:scope.row.organId}}">{{scope.row.officeExcessivePersonNum}}</router-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="服务用房">
            <el-table-column prop="serviceCheckArea" label="核定使用面积上限(㎡)" width="170">
            </el-table-column>
            <el-table-column prop="serviceRealUseArea" label="实际使用面积(㎡)" width="140">
              <template slot-scope="scope">
                <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-housing-list',query:{organName:scope.row.organName,organId:scope.row.organId,roomTypeIds:'SERVICEHOUSE'}}">{{scope.row.serviceRealUseArea}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="serviceExcessiveArea" label="超标面积(㎡)" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="设备用房">
            <el-table-column prop="equipCheckArea" label="核定使用面积上限(㎡)" width="170">
            </el-table-column>
            <el-table-column prop="equipRealUseArea" label="实际使用面积(㎡)" width="150">
              <template slot-scope="scope">
                <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-housing-list',query:{organName:scope.row.organName,organId:scope.row.organId,roomTypeIds:'EQUIPHOUSE'}}">{{scope.row.equipRealUseArea}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="equipExcessiveArea" label="超标面积(㎡)" width="132">

            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="附属用房">
            <el-table-column prop="affiliatedCheckArea" label="核定使用面积上限(㎡)" width="170">
            </el-table-column>
            <el-table-column prop="affiliatedRealBuildArea" label="实际使用面积(㎡)" width="140">
            </el-table-column>
            <el-table-column prop="affiliatedExcessiveArea" label="超标面积(㎡)" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-housing-list',query:{organName:scope.row.organName,organId:scope.row.organId,roomTypeIds:'AFFILIATEDHOUSE'}}">{{scope.row.affiliatedExcessiveArea}}</router-link>
              </template>
            </el-table-column>
          </el-table-column>           -->
        </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      verification: [],
      actual: [],
      activeName: '超标单位',
      company: '',
      organLeve: '',//单位级别
      dataHistory: [], //保存的历史数据 
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      initWidth: '',
      areaName: '', //地区
      list: [], // 列表数据集合
      roomTypeIds: '',
      organNameSelectList: [],//单位名称
      organNameLevelList: [],//单位所在层级
      sortClickNum: '',
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['核定面积', '实际面积']
        },
        grid: {
          top: '9%',
          left: '9%',
          right: '9%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['办公室', '服务用房', '设备用房']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        color: ['#FF704F', '#668DDF'],
        series: [
          {
            name: '核定面积',
            type: 'bar',
            barGap: '0%',//间距
            barWidth: 60,//柱图宽度
            barMinHeight: 1,//最低数据显示
            data: []
          },
          {
            name: '实际面积',
            type: 'bar',
            barGap: '0%',//间距
            barWidth: 60,//柱图宽度
            barMinHeight: 1,//最低数据显示
            data: []
          },
        ]
      },
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
    this.getOrganLevel();
    this.getSelect();
    this.company = '';
    this.getDataRequest();
    this.myChart = echarts.init(document.getElementById('main'));
    // this.myChart.setOption(this.option);
  },
  mounted() {
    this.init();
    this.calculateEcharts()

  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },

  },
  methods: {
    //排序
    getSort(param) {
      if (param.column && param.column.sortable == "RoomUseArea") {
        if (param.order === 'ascending') {
          this.sortClickNum = 'ASC';
        } else if (param.order === 'descending') {
          this.sortClickNum = 'DESC';
        } else {
          this.sortClickNum = '';
        }
      }
      this.getDataRequest();

    },

    renderHeader(h, { column }) {
      return h(
        'div',
        [
          h('span', column.label),
          h('el-tooltip', {
            props: {
              effect: 'dark',
              content: '办公室超标面积：是指所有的超标人员的超标面积之和；',
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
    // 图表大小自适应
    init() {
      setTimeout(() => {
        window.onresize = () => {
          let resize = {
            width: this.initWidth,
            height: 400
          };
          this.myChart.resize(resize);
        };
      }, 500);
    },
    // 获取下拉选单位名称
    getSelect() {
      let params = {
        areaId: this.$store.state.mainData.areaId
      }
      this.$axiosGet(API.certificateRoom_getOrganByOrganId, params).then(res => {
        this.organNameSelectList = res.data;
      })
    },
    // 获取单位所在层级下拉选
    getOrganLevel() {
      let params = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.excessvie_getOrganLevel, params).then(res => {
        this.organNameLevelList = res.data;
      })
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    //重新计算echarts的宽度
    calculateEcharts() {
      //获取这个组件的窗口宽度
      this.initWidth = document.getElementById('main').offsetWidth;
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        adminOrganId: this.loginOrganId,
        organName: this.company || '',
        level: this.organLeve || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.excessvie_excessiveOrganList, params).then(res => {
        let list = [];
        if (res.code == 200) {
          this.list = res.data.pageResponse;
        } else {
          this.list = []
        }

        if (res.data) {
          this.verification = [];
          this.actual = [];
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          let excessive = res.data.allExcessiveOrganResponseList;
          if (excessive.length > 0) {
            this.option.series[0].data = [excessive[0].totalOfficeCheckArea, excessive[1].totalServiceCheckArea, excessive[2].totalEquipCheckArea]
            this.option.series[1].data = [excessive[0].totalOfficeRealUseArea, excessive[1].totalServiceRealUseArea, excessive[2].totalEquipRealUseArea]
          } else {
            this.option.series[0].data = [];
            this.option.series[1].data = [];
          }
          this.myChart.setOption(this.option);
          if (res.data.pageResponse.data) {
            list = res.data.pageResponse.data;
            this.total = res.data.pageResponse.total;
            this.list = list;
          } else {
            this.list = [];
            this.total = 0;
          }
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
              item.excessiveOrganResponse = (item.officeExcessiveArea + item.serviceExcessiveArea + item.equipExcessiveArea + item.affiliatedExcessiveArea).toFixed(2)
            });
          }
        }
        this.sortClickNum = '';
      });
    },
    // 导出功能
    // exportClick() {
    //   // this.pushdate = FORMATGET.formatGET(this.defaultTime)
    //   let params = {
    //     areaId: this.areaId,
    //     areaName: this.areaName,
    //     // queryTime: FORMATGET.formatGET(this.defaultTime), //查询时间  
    //     company: this.company,//查询单位
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_getExcessiveAreaData, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   });
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },

    getSummaries(param) { // 自定义表格合计
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (column.label === '序号') {
          sums[index] = '合计';
          return;
        } else if (column.label === '院落名称') {
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev
            }
          }, 0);
          if (index === 3) {
            sums[index] = sums[index].toFixed(2)
          }
          if (index === 9) {
            sums[index] = sums[index].toFixed(2)
          }
        }
      });
      return sums;
    }
  },
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.el-table {
  thead {
    th {
      .cell {
        border-left: 0 !important;
      }
    }
  }
}
</style>
