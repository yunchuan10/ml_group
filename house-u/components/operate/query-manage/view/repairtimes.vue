<template>
  <div>
    <div class="h-table">
      <div id="Combarline" style="width: calc(100% - 20px); height: 400px;">
      </div>

      <el-table :data="list" stripe style="width: auto">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="useOrganName" label="维修时间">
          <template slot-scope="scope">
            <a>{{ scope.row.useOrganName || ''}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="useRoomNum" label="维修地点">
          <template slot-scope="scope">
            {{ scope.row.useRoomNum || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="useAreaSum" label="维修内容">
          <template slot-scope="scope">
            {{scope.row.useAreaSum || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="useAreaSum" label="维修费用（元）">
          <template slot-scope="scope">
            {{scope.row.useAreaSum || ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  data() {
    return {
      activeName: '数量',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      // courtyardId: '', //院落id
      useOrganId: '', //使用单位id
      useOrganName: '',//使用单位名称
      useRoomNum: '',//使用单位数量
      useAreaSum: '',//使用单位面积
      list: [], //表格列表信息
      mybarlineChart: {}, // 使用单位图表
      chartOption: {
        title: [
          {            text: '',
            textStyle: { fontSize: 16, },
            top: 10,
            left: 10,
          }],
        tooltip: { trigger: 'axis', },
        grid: {
          left: '4%',
          right: '4%',
          containLabel: true
        },
        toolbox: {
          top: 10,
          right: '4%',
          itemSize: 20
        },
        legend: {
          data: ['维修费用', '维修次数']
        },
        xAxis: [{
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            color: '#3c434c',
            interval: 0
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e1e2e3'
            },
          },
          data: []
        }],
        yAxis: [
          {
            type: 'value',
            name: '维修费用',
            min: 0,
            position: 'right',
            axisLabel: {
              formatter: '{value} ㎡',
              color: '#3c434c'
            },
            axisTick: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e1e2e3'
              },
            }
          },
          {
            type: 'value',
            name: '维修次数',
            min: 0,
            interval: 1,
            minInterval: 1,
            position: 'left',
            axisLabel: {
              formatter: '{value} 个',
              color: '#3c434c'
            },
            axisTick: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e1e2e3'
              },
            }
          }],
        color: ['#4b7efe', '#ff5560'],
        series: [{
          name: '维修次数',
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            normal: {
              //柱形图圆角，初始化效果
              barBorderRadius: [2, 2, 2, 2]
            }
          },
          yAxisIndex: 1,
          data: []
        },
        {
          name: '维修费用',
          type: 'line',
          lineStyle: {
            normal: {
              width: 2,
            }
          },
          data: []        }

        ]
      },
    }
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    },

  },
  watch: {
    'courtyardId': function (val) {
      this.getCombarlinedata();
    }
  },
  activated() {
    this.getCombarlinedata();
    this.mybarlineChart = echarts.init(document.getElementById('Combarline'));
    this.mybarlineChart.setOption(this.chartOption);
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.mybarlineChart.resize();
        };
      }, 500);
    },
    //获取图表的值
    getCombarlinedata() {
      let params = {
        courtyardId: this.courtyardId,
      }
      this.$axiosPost(API.yardSearch_organCount, params).then(res => {
        let organNamelist = [];
        let organAreaList = [];
        let organNumList = [];
        let list = res.data || [];

        list.forEach((item, index) => {
          organNamelist.push(item.useOrganName);
          organAreaList.push(item.useAreaSum);
          organNumList.push(item.useRoomNum);
        })

        this.chartOption.xAxis[0].data = organNamelist || '';
        this.chartOption.series[0].data = organNumList || '';
        this.chartOption.series[1].data = organAreaList || '';
        this.mybarlineChart.setOption(this.chartOption);
        this.getDataRequest();
      })
    },

    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.yardSearch_organList, params).then(res => {
        let list = [];
        list = res.data.data;
        this.total = res.data.total;
        this.useOrganName = res.data.useOrganName;
        this.useRoomNum = res.data.useRoomNum;
        this.useAreaSum = res.data.useAreaSum;
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
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
.u-grid-table {
  float: left;
  width: 100%;
  margin-top: 20px;
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
</style>
