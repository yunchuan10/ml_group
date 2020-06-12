<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div id="mainbar" name='num' style="width: calc(100% - 20px); height: 400px;">
        </div>
      </div>
      <div class="f-clearfix"></div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>工程名称</span>
                  <el-input clearable v-model="search.projectName" placeholder="请输入工程名称"></el-input>
                </li>
                <li>
                  <span>工程类型</span>
                  <el-select v-model="search.projectType" clearable placeholder="请输入工程类型">
                    <el-option v-for="item in projectTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="u-grid-table">
        <el-table :data="list" stripe style="width: auto">
          <el-table-column fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="工程名称">
            <template slot-scope="scope">
              <a @click="accountsDetailClick(scope.row.id)">{{scope.row.projectName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="projectTypeName" label="工程类型"></el-table-column>
          <el-table-column prop="projectLevelName" label="工程级别"></el-table-column>
          <el-table-column prop="commencementDate" :formatter="dateFormat" label="开工日期"></el-table-column>
          <el-table-column prop="completionDate" :formatter="dateFormat" label="竣工日期"></el-table-column>
          <el-table-column prop="closingMoney" label="决算金额（万元）"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="h-table-bottom">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 详情弹出框 -->
    <accounts-detail ref="accountsDetail"></accounts-detail>
  </div>
</template>

<script>
import accountsDetail from '@/components/maintenance-manage/accounts/accounts-detail'; // 详情弹出框
export default {
  components: {
    'accounts-detail': accountsDetail //维修台账详情
  },
  data() {
    return {
      activeName: '数量',
      filterText: '',
      total: 0, // 数据总数
      projectTypeList: [], //工程类型集合
      search: {
        projectName: '', //工程名称
        projectType: '', //工程类型
      },
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], //表格列表信息
      projectTypeNameList: [], //工程项目集合
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chatOptions: {
        title: [{
          text: '',
          textStyle: { fontSize: 16 },
          top: 10,
          left: 0,
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: '15%',
          data: ['仅办理房产证', '仅办理土地证', '已办理，且两证分离', '已办理，且两证合一'],
          textStyle: {
            color: '#3c434c'
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#3c434c',
              interval: 0,
              rotate: -15
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#999'
              },
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '决算金额(万元)',
            minInterval: 1,
            boundaryGap: [0, 0.3],
            axisLine: {
              show: true,
              lineStyle: {
                color: '#999'
              },
            },
            axisTick: { show: false },
            splitLine: {
              show: true
            },
            axisLabel: {
              color: '#3c434c'
            }
          }
        ],
        color: ['#4b7efe', '#ff704f', '#29cc97', '#fec400'],
        series: [
          {
            name: '决算金额(万元)',
            type: 'bar',
            barWidth: '60%',
            data: []
          },
        ]
      },
      myChart1: {}
    }
  },
  activated() {
    this.myChart1 = echarts.init(document.getElementById('mainbar'));
    this.myChart1.setOption(this.chatOptions);
    this.getSelectData();
    this.getOwnerCount();
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
    userId() {
      return this.$store.state.mainData.userId  
    }
  },
  watch: {
    'courtyardId': function (val) {
      this.getOwnerCount();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 详情
    accountsDetailClick(id) {
      this.$refs.accountsDetail.openModal(id);
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest()
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0,10);
    },
    getOwnerCount() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.yardSearch2_table3Data, params).then(res => {
        let projectTypeNameList = [];
        let closingMoneySumList = [];
        if (res.data) {
          res.data.forEach((item, index) => {
            projectTypeNameList.push(item.projectTypeName)
            closingMoneySumList.push(item.closingMoneySum)
          })
          this.chatOptions.xAxis[0].data = projectTypeNameList;
          this.chatOptions.series[0].data = closingMoneySumList || '0';
          this.myChart1.setOption(this.chatOptions);
        } else {
          this.myChart1.clear();
        }
        this.getDataRequest();
      })
      // 
    },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        projectName: this.search.projectName,
        projectType: this.search.projectType || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.yardSearch2_listMaintain, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data;
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    // 获取下拉选
    getSelectData() {
      this.$axiosGet(API.yardSearch2_getTable3Select, {}).then(res => {
        this.projectTypeList = res.data||[];
      })
    },
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
.h-table {
  float: left;
}
.m-search {
  z-index: 99;
}
#mainbar {
  z-index: 1;
}
.u-grid-table {
  float: left;
  width: 100%;
  margin-top: 10px;
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 370px;
  clear: both;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
  }
}
</style>
