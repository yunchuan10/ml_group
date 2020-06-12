<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <!-- <div class="u-grid-charttab">
          <el-radio-group v-model="activeName" @change="getClick" size="small" style="margin-right:-20px;">
            <el-radio-button label="金额">金额</el-radio-button>
            <el-radio-button label="数量">数量</el-radio-button>
          </el-radio-group>
        </div> -->
        <div id="mainbar" name='num' style="width: calc(100% - 10px); height: 350px;">
          <!-- <div id="mainbar" name='num' style="width: calc(100% - 300px); height: 350px;"> -->
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">

                <li>
                  <span>合同编号</span>
                  <el-input clearable filterable placeholder="请输入合同编号" v-model="contractNo"></el-input>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入承租人" v-model="lesseeName"></el-input>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="useStatus" clearable filterable placeholder="请选择状态">
                    <el-option label="已入账" value='YES'></el-option>
                    <el-option label="逾期" value='OVERDUE'></el-option>
                    <el-option label="即将到期" value='DUE'></el-option>
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
          <!-- <el-table-column prop="contractStartDate" label="合同开始日期">
            <template slot-scope="scope">
              {{scope.row.contractStartDate ? scope.row.contractStartDate.substr(0, 10):'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="contractEndDate" label="合同结束日期">
            <template slot-scope="scope">
              {{scope.row.contractEndDate ? scope.row.contractEndDate.substr(0, 10):'-'}}
            </template>
          </el-table-column> -->
          <el-table-column prop="contractNo" label="合同编号">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.contractId,'合同')">{{scope.row.contractNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="rentOrgan" label="出租方">
          </el-table-column>
          <el-table-column prop="lesseeName" label="承租人">
          </el-table-column>
          <el-table-column label="租金起止日期" width="200">
            <template slot-scope="scope">
              {{scope.row.startDate ? scope.row.startDate.substr(0, 10):'-'}}—{{scope.row.endDate ? scope.row.endDate.substr(0, 10):'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="money" label="应交租金（元）">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.id,'租金')">{{scope.row.money}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="缴纳时长" width="100">
          </el-table-column>
          <el-table-column prop="statusName" label="状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.statusName)"> {{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remainingDays" label="租金到期提醒">
            <template slot-scope="scope">
              {{scope.row.statusName == "已入账" ? '--' : scope.row.statusName == "即将到期" ? '剩余：'+scope.row.remainingDays+'天' : '逾期：'+scope.row.remainingDays+'天'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="h-table-bottom">
      <!-- <div class="h-table-btns f-pull-left">
        <button class="el-button-export">
          <i class="iconfont icon-daochu"></i>导出</button>
      </div> -->
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 详情弹出框 -->
    <ownership-detail ref="ownershipDetail"></ownership-detail>
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>

<script>
import ownershipDetail from '@/components/operate/room-manage-street/room-registernum'; // 详情弹出框 - 租金
import roomDetail from '@/components/operate/room-manage/room-companynum'; // 详情弹出框 - 合同
export default {
  components: {
    'ownership-detail': ownershipDetail,
    'v-room-detail': roomDetail
  },
  data() {
    return {
      activeName: '金额',
      filterText: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      moni: '', //模拟数据
      list: [], //表格列表信息
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chatOptions: {
        color: ['#409eff', '#f56c6c', '#e6a23c'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '15%',//距上边距
          left: '10%',//距离左边距
          // right: '5%',//距离右边距
          bottom: '1%',//距离下边距
          containLabel: true
        },
        // legend: {
        //   // type: 'scroll',
        //   // orient: 'vertical',
        //   // right: 200,
        //   top: 20,
        //   // bottom: 20,
        //   itemGap: 20,
        //   itemWidth: 20,          // 图形宽度。
        //   itemHeight: 10,         // 图形高度。 
        //   data: ['已入账租金', '已逾期租金', '即将到期租金'],

        // },
        xAxis: [
          {
            type: 'category',
            data: ['已入账租金', '已逾期租金', '即将到期租金'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位：元',
            boundaryGap: [0, 0.1],
            axisLabel: {
              // formatter: '{value} ㎡'
            },
            minInterval: 1, //柱形图Y轴为整数
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            barWidth: '17%',
            data: [],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#409eff', '#f56c6c', '#e6a23c'];
                  return colorList[params.dataIndex];
                }
              },
            }
          },
        ],
      },
      organList: [], //单位集合
      myChart1: {},
      contractNo: '', //合同编号查询
      lesseeName: '', //承租人姓名查询
      useStatus: '', // 状态查询
    }
  },
  activated() {
    this.contractNo = '';
    this.lesseeName = '';
    this.useStatus = '';
    this.myChart1 = echarts.init(document.getElementById('mainbar'));
    this.myChart1.setOption(this.chatOptions);
    this.getCombarlinedata();
    this.getTableData();
    this.getList()
    this.init();
  },
  computed: {
    operateStreet() {
      return this.$store.state.mainData.operateStreet;
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    areaId() {
      return this.$store.state.mainData.areaId
    }
  },
  watch: {
    'operateStreet': function (val) {
      this.getCombarlinedata();
      this.getList()
    }
  },
  mounted() {
  },
  methods: {
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    // 获取列表数据
    getList() {
      let params = {
        street: this.operateStreet,
        contractNo: this.contractNo || '',
        lesseeName: this.lesseeName || '',
        rentalStatus: this.useStatus || '',
        pageNum: this.page,
        pageSize: this.pageSize,
      }
      this.$axiosGet(API.comprehensive_getStreetRentalPage, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.pageResponse.data || [];
          this.total = res.data.pageResponse.total;
          if (list.length > 0) {
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
    // 详情
    roomDetailInfoClick(roomId, type) {
      if (type == '合同') {
        this.$refs.roomDetail.openModal(roomId);
      } else {
        this.$refs.ownershipDetail.openModal(roomId);
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getList();
    },
    getClick() {
      this.getCombarlinedata()
    },
    //获取图表的值
    getCombarlinedata() {
      let params = {
        street: this.operateStreet,
        areaId: this.areaId,
      }
      this.$axiosGet(API.comprehensive_getStreetRentEchart, params).then(res => {
        if (res.data) {
          this.houseStatusNamelist = res.data
          let roomUseList = [];
          let legend = [];
          if (this.houseStatusNamelist.echartRentResponseList) {
            roomUseList.push({
              value: this.houseStatusNamelist.echartRentResponseList[0].totalRentalMoney || '0',
              name: `已入账租金`
            })
          }
          if (this.houseStatusNamelist.echartRentOverDueResponseList) {
            roomUseList.push({
              value: this.houseStatusNamelist.echartRentOverDueResponseList[0].totalRentalMoney || '0',
              name: `已逾期租金`
            })
          }
          if (this.houseStatusNamelist.echartRentDueResponseList) {
            roomUseList.push({
              value: this.houseStatusNamelist.echartRentDueResponseList[0].totalRentalMoney || '0',
              name: `即将到期租金`
            })
          }
          roomUseList.forEach((item) => {
            legend.push(item.value)
          })
          this.chatOptions.series[0].data = roomUseList || [];
          // this.chatOptions.legend.data = legend;
          // this.$set(this.chatOptions.legend, 'formatter', this.getLengendForMatter);
          this.myChart1.setOption(this.chatOptions); //this.options为车辆状态的配置
          // } else {
          // this.roomStatusCountList = [];
          // this.chatOptions.series[0].data = [];
          // }
          // this.myChart1.setOption(this.chatOptions);
        }
      })
    },
    //后缀
    getLengendForMatter(name) {
      let value = '';
      this.chatOptions.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        return `${name}：${value}元`;
      }
    },
    getSearch() {
      this.page = 1;
      this.getList();
    },

    getTableData() {
      // this.$axiosPost(API.rent_getRentalInformationSelect, '').then(res => {
      //   this.useStatusList = res.data;
      // })
    },
    checkStatus(value) {
      if (value == '即将到期') {
        return 's-state-caveat'
      } else if (value == '逾期') {
        return 's-state-prohibited'
      } else if (value == '已入账') {
        return 's-state-apply'
      }
    },
  }

};
</script>

<style lang="scss" scoped>
.h-table {
  float: left;
  margin: -20px 0 20px 0 !important;
}
.u-grid-table {
  float: left;
  width: 100%;
  margin-top: 10px;
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
  height: 360px;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 12%;
    top: 15%;
  }
}
.el-row {
  margin-bottom: 20px;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
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
