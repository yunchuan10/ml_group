<template>
  <div>
    <div class="h-table" style="margin: 0">
      <div class="u-query-top f-relative minH" style="margin-top: 0">
        <h2 class="u-query-h2">{{organName}}-办公用房面积总体核定情况</h2>
        <!-- <div class="m-search">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                  <li>
                    <span>当前办公地址</span>
                    <el-select v-model="useStatus" filterable placeholder="请选择使用状态">
                      <el-option label="全部" value=''></el-option>
                      <el-option v-for="(item, index) in useStatusList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                    </el-select>
                  </li>
                </ul>
              </td>
              <td class="u-search-but">
                <el-button class="f-search-but" @click="getSearch">查询</el-button>
              </td>
            </tr>
          </table>
        </div> -->
        <div id="housePie" name='num' style="width: 400px; height: 320px; position:absolute;">
        </div>
        <div class="u-query-right">

          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th>类型</th>
                <th>按“三定”方案核定上限（㎡）</th>

                <th>实际面积（㎡）</th>
              </tr>
              <tr v-for="(item,index) in list" :key='index'>
                <td align="center">
                  {{item.roomTypeName}}
                </td>
                <td align="center">
                  {{item.roomTypeId == 'AFFILIATEDHOUSE' ? item.checkAreaSum || '0' : item.checkAreaSum || '0'}}
                </td>
                <td align="center">{{item.roomTypeId == 'AFFILIATEDHOUSE'?item.roomBuildAreaSum||'0':item.roomUseAreaSum||'0'}}</td>
              </tr>
              <!-- <tr>
                <td align="center">
                  <span class="f-color-red f-weight-bold"> 合计：</span>
                </td>
                <td align='center'>
                  <span class="f-color-red f-weight-bold"> {{checkTotal | dot2 }}</span>
                </td>
                <td align='center'>
                  <span class="f-color-red f-weight-bold"> {{userTotal | dot2}}</span>
                </td>
              </tr> -->
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      activeName: '数量',
      organName: '', //单位名称
      userTotal: 0, //使用面积总计
      checkTotal: 0, //面积总计
      dutiesLevel: '', //	职务级别
      roomNo: '', //房间号
      roomAddress: '', //房间位置
      standardArea: '', //标准面积
      realShareArea: '', //实际分摊面积
      excessive: '', //超标情况
      isEstablished: '', //编制情况
      myChartOne: {},
      duty: '', //职务名称     
      list: [], //表格列表信息  
      dutiesLevelList: [], //职务级别集合
      realName: '', //姓名
      dutiesLevelId: '', //职务id
      chartOptionsOne: {
        color: ['#4b7efe', '#ff704f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['核定面积', '实际面积']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0,
              rotate: 45//角度顺时针计算的
            }
            // axisTick: {
            //   alignWithLabel: true
            // }

          },
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.1],
            axisLabel: {
              formatter: '{value} ㎡'
            }
          }
        ],
        series: [
          {
            name: '核定面积',
            type: 'bar',
            data: []
          },
          {
            name: '实际面积',
            type: 'bar',
            data: []
          }
        ]
      },
    }
  },
  computed: {
    generalOrganId() {
      return this.$store.state.mainData.generalOrganId;
    }
  },
  watch: {
    'generalOrganId': function (val) {
      this.getEchartData();
    }
  },
  activated() {
    this.myChartOne = echarts.init(document.getElementById('housePie'));
    this.myChartOne.setOption(this.chartOptionsOne);
    this.getEchartData();
    this.getDutySelect();
  },

  mounted() {
  },
  methods: {
    //获取职务级别
    getDutySelect() {
      let params = {
        organId: this.generalOrganId,
      }
      this.$axiosPost(API.useSummary_findOrganDutiesByOrganId, params).then(res => {
        if (res.data) {
          this.dutiesLevelList = res.data;
        } else {
          this.dutiesLevelList = [];
        }
      })
    },
    getEchartData() {
      let params = {
        useOrganId: this.generalOrganId
      }
      this.$axiosGet(API.organSearch2_getTable2Data, params).then(res => {
        let roomTypeList = [];
        let userAreaList = [];
        let checkAreaList = [];
        this.userTotal = 0;
        this.checkTotal = 0;
        if (res.data) {
          this.list = res.data;
          this.organName = this.list[0].organName;
          res.data.forEach((item, index) => {
            roomTypeList.push(item.roomTypeName)
            // userAreaList.push(item.roomUserAreaSum)
            checkAreaList.push(item.checkAreaSum)
            this.checkTotal = this.checkTotal + item.checkAreaSum
            if (item.roomTypeId == 'AFFILIATEDHOUSE') {
              this.userTotal += item.roomBuildAreaSum
              userAreaList.push(item.roomBuildAreaSum)
            } else {
              userAreaList.push(item.roomUseAreaSum)
              this.userTotal = this.userTotal + item.roomUseAreaSum
            }

          })
          this.organName = this.list[0].organName;
        } else {
          this.list = [];
        }
        this.chartOptionsOne.xAxis[0].data = roomTypeList;
        this.chartOptionsOne.series[0].data = checkAreaList;
        this.chartOptionsOne.series[1].data = userAreaList;
        this.myChartOne.setOption(this.chartOptionsOne);
      })
    },
  }

};
</script>

<style lang="scss" scoped>
.h-table {
  float: left;
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
.minH {
  min-height: 516px;
}
.u-query-h2 {
  text-align: center;
  font-size: 18px;
}
.u-grid-table {
  float: left;
  width: 100%;
  margin-top: 20px;
}
.f-color-red {
  color: rgb(224, 15, 26);
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
  clear: both;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
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
.f-absolute {
  position: absolute !important;
}
</style>
