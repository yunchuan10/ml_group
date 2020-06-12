<template>
  <div>
    <section class="m-main">
      <div class="operate-home f-clearfix">
        <div class="operate-item f-relative">
          <div class="home-title">
            <span></span>房屋状态</div>
          <div class="u-grid-charttab f-absolute">
            <el-radio-group v-model="activeName" @change="getSwitch" size="small">
              <el-radio-button label="数量">数量</el-radio-button>
              <el-radio-button label="面积">面积</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="houseChart" class="operate-item-chart "></div>
        </div>
        <div class="operate-item">
          <div class="home-title">
            <span></span>合同状态</div>
          <div ref="contractChart" class="operate-item-chart "></div>
        </div>
        <div class="operate-item">
          <div class="home-title">
            <span></span>租金状态</div>
          <div ref="rentChart" class="operate-item-chart"></div>
        </div>
      </div>
      <div class="operate-home">
        <div class="operate-item2">
          <div class="home-title">
            <span></span>合同到期提醒</div>
          <div class="operate-item2-box">
            <div class="operate-box-content f-clearfix">
              <h2>进行中合同
                <span class="f-text-color">{{dealConNum}}</span>份</h2>
              <router-link to="/operate/contract-manage/contractinfo-list">▪▪▪&nbsp;更多</router-link>
            </div>
            <div class="h-table">
              <el-table :data="dealConInfo" height="500" border style="width: 100%">
                <el-table-column prop="date" label="序号" width="50" type="index">
                </el-table-column>
                <el-table-column prop="contractNo" label="合同编号">
                </el-table-column>
                <el-table-column prop="startDate" label="合同开始日期">
                  <template slot-scope="scope">
                    {{checkTime(scope.row.startDate)}}
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" label="合同结束日期">
                  <template slot-scope="scope">
                    {{checkTime(scope.row.endDate)}}
                  </template>
                </el-table-column>
                <el-table-column prop="lesseeName" label="承租人">
                </el-table-column>
                <el-table-column prop="rental" label="租金（元/年）">
                </el-table-column>
                <el-table-column prop="remainingDays" label="合同到期提醒">
                  <template slot-scope="scope">
                    {{scope.row.remainingDays?'剩余：'+scope.row.remainingDays+'天' : '' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="operate-item2">
          <div class="home-title">
            <span></span>租金到期提醒</div>
          <div class="operate-item2-box f-clearfix">
            <div class="operate-box-content f-clearfix">
              <h2>即将到期租金
                <span class="f-text-color">{{dealRentNum}}</span>笔</h2>
                <h2 style="padding-left:10px;">逾期租金
                <span class="f-text-color">{{dealoverNum}}</span>笔</h2>
              <router-link to="/operate/reprises-manage/reprises-list">▪▪▪&nbsp;更多</router-link>
            </div>
            <div class="h-table">
              <el-table :data="dealRentInfo" height="500" border style="width: 100%">
                <el-table-column prop="date" label="序号" width="50" type="index">
                </el-table-column>
                <el-table-column prop="lesseeName" label="承租人">
                </el-table-column>
                <el-table-column prop="startDate" width="110px" label="租金起止日期">
                  <template slot-scope="scope">
                    {{checkTime(scope.row.startDate)}}-{{checkTime(scope.row.endDate)}}
                  </template>
                </el-table-column>
                <el-table-column prop="contractRental" width="110px" label="应交租金(元)">
                </el-table-column>
                <el-table-column prop="duration" label="缴纳时长">
                </el-table-column>
                <el-table-column prop="money" label="租金（元/年）">
                </el-table-column>
                <el-table-column prop="remainingDays" label="租金到期提醒">
                  <template slot-scope="scope">
                    {{scope.row.statusName == "即将到期" ? scope.row.remainingDays>= 0 ? '剩余：'+scope.row.remainingDays+'天' : '' : scope.row.remainingDays>= 0 ? ('逾期：'+scope.row.remainingDays+'天') : '' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 租金到期提醒结束 -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: '',
      activeName: '数量',
      houseData: [], //房屋图表数据
      contractData: [], //合同状态图表数据
      dealConInfo: [], //合同到期提醒
      dealRentInfo: [], //租金到期提醒
      dealConNum: '', //合同即将到期数量
      dealRentNum: '', //租金即将到期数量
      dealoverNum:'', //逾期
      enterRentNum: '', //入账租金
      overdueNum: '',//逾期租金
      expireRentNum: '',//即将到期

    }
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },

  },
  activated() {
    this.getGeneralData()
    setTimeout(() => {
      this.houseChart();
      this.contractChart();
      this.rentChart()
    }, 0);
  },

  mounted() {


  },
  // destroyed() {
  //   window.removeEventListener('resize', this.resizeHandle)
  // },
  methods: {
    checkTime(value) {
      if (value) {
        return value.substr(0, 10)
      } else {
        return ''
      }
    },

    houseChart(data, active) {
      let myChart = echarts.init(this.$refs.houseChart)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b},{d}%"
        },
        legend: {
          data: ['出租中', '闲置'],
          orient: 'vertical',
          bottom: '35',
          right: '50',
          formatter: function (params) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].name == params) {
                if (active === '数量') {
                  return params + ":" + '\xa0\xa0\xa0' + data[i].value + "处";
                } else {
                  return params + ":" + '\xa0\xa0\xa0' + data[i].value + "㎡";
                }

              }
            }
          }
        },
        series: [{
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['20%', '40%'],
          color: ['#66C33A', '#C3B98F'],
          data: data,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b}: \n {d}%'
              }
            },
          },
        }]
      })
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },

    contractChart(data) {
      let myChart = echarts.init(this.$refs.contractChart)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b},{d}%"
        },
        legend: {
          data: ['已解除', '进行中', '已结束'],
          orient: 'vertical',
          bottom: '35',
          right: '10%',
          formatter: function (params) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].name == params) {
                return params + ":" + '\xa0\xa0\xa0' + data[i].value + "份";
              }
            }
          }
        },
        series: [{
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['20%', '40%'],
          color: ['#67C23A', '#E6A23C', '#F56C6C'],
          data: data,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b}: \n {d}%'
              }
            },
          },
        }]
      })
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    rentChart(data) {
      let myChart = echarts.init(this.$refs.rentChart)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '15%',//距离左边距
          right: '10'
        },
        xAxis: [
          {
            type: 'category',
            data: ['已入账租金', '即将到期租金', '已逾期租金'],
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#3c434c',
              interval: 0,
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
            name: '单位：元',
            minInterval: 1,
            boundaryGap: [0, 0.8],
          }
        ],
        color: ['#4b7efe'],
        series: [
          {
            name: '租金',
            type: 'bar',
            barWidth: '30%',
            data: data
          },
        ]
      })
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },

    getSwitch() {
      this.getGeneralData()
    },

    //获取页面数据
    getGeneralData() {
      let params = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.generaloverview_getGeneralOverview, params).then(res => {
        if (res.data) {
          if (res.data.echartHouseResponseList) {
            this.houseData = res.data.echartHouseResponseList; //房屋状态图表
            let data = [];
            this.houseData.forEach((item, index) => {
              if (this.activeName === '数量') {
                data.push({
                  value: item.totalNum || '0',
                  name: item.houseStatusName
                })
              }
              else {
                data.push({
                  value: item.totalBuildArea || '0',
                  name: item.houseStatusName
                })
              }
            })
            this.houseChart(data, this.activeName)
          } else {
            this.houseData = []
          }
          if (res.data.echartContractResponseList) {
            this.contractData = res.data.echartContractResponseList;  //合同状态图表
            let contData = [];
            this.contractData.forEach((item, index) => {
              contData.push({
                value: item.totalNum || '0',
                name: item.contractStatusName
              })
            })
            this.contractChart(contData)
          } else {
            this.contractData = []
          }
          if (res.data.contractResponseList) {
            this.dealConInfo = res.data.contractResponseList;
          } else {
            this.dealConInfo = [];
          }
          if (res.data.rentalInformationResponseList) {
            this.dealRentInfo = res.data.rentalInformationResponseList; // 租金到期提醒
          } else {
            this.dealRentInfo = []
          }
          this.dealConNum = res.data.dealContractProgressNum;
          this.dealRentNum = res.data.dueRentalInformationNum;
          this.dealoverNum = res.data.overDueRentalInformationNum; //逾期
          let roomRentData = []; //租金状态图表
          if (res.data.rentStatusCountResponses) {
            res.data.rentStatusCountResponses.forEach((item) => {
              roomRentData.push(item.totalRentalMoney)
            })
          }
          this.rentChart(roomRentData)
        }
      })
    },
  }
};



</script>



<style lang="scss" scoped>
.operate-home {
  display: flex;
  padding: 10px 0;
  .operate-item {
    flex: 1;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.operate-item-chart {
  width: 100%;
  height: 400px;
  padding: 5px;
  border-radius: 8px;
  box-sizing: border-box;
  -webkit-box-shadow: 2px 4px 5px #e4e7ed;
  box-shadow: 2px 4px 5px #e4e7ed;
}
.u-grid-charttab {
  z-index: 1;
  right: 20px;
  top: 50px;
}
.operate-item2 {
  // flex: 1;
  width: 50%;
  margin: 5px;
  box-sizing: border-box;
  .operate-item2-box {
    border-radius: 8px;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 2px 4px 5px #e4e7ed;
    box-shadow: 2px 4px 5px #e4e7ed;
  }
}
.operate-box-content {
  width: 100%;
  h2 {
    float: left;
  }
  a {
    float: right;
  }
}
</style>
