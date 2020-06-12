<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['营收统计']"></zl-breadcrumb>
      </div>

      <div class="pic-num-box" >
        <div class="picNum">
          <img class="f-inline-block" :src="$store.state.imgPath.iconMoney">
          <span class="f-inline-block" style="margin-left:20px;">
            <span class="f-block f-weight-bold" style="font-size:36px;">12</span>
            <span class="f-block" style="font-size:16px;">会议室总营收（元）</span>
          </span>
        </div>
        <div class="picNum">
          <img class="f-inline-block" :src="$store.state.imgPath.iconMoney">
          <span class="f-inline-block" style="margin-left:20px;">
            <span class="f-block" style="font-size:16px;">同比增长：80%</span>
          </span>
        </div>
        <div class="picNum">
          <img class="f-inline-block" :src="$store.state.imgPath.iconMoney">
          <span class="f-inline-block" style="margin-left:20px;">
            <span class="f-block" style="font-size:16px;">环比增长：60%</span>
          </span>
        </div>
      </div>

      <div>
        <div class="f-relative" style="z-index: 10;padding: 30px 0 10px">
          <!-- 查询条件部分 -->
          <div class="m-search">
            <zl-searchLayout @click="getDataRequest">
              <el-form-item label="时间">
                <el-date-picker v-model="search.time" type="year" placeholder="选择年"></el-date-picker>
              </el-form-item>
            </zl-searchLayout>
          </div>
        </div>
        <!-- 折线图 -->
        <div id="lineEchart" style="width:100%;height:400px;"></div>
        <!-- 柱形图 -->
        <div id="barEchart" class="f-inline-block" style="width:100%;height:400px;margin-top:20px;"></div>
      </div>

      <div class="h-table f-relative" style="margin-top:40px;">
        <div class="f-weight-bold" style="font-size:16px;margin-bottom:20px;">客户消费额Top10</div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55px"></el-table-column>
          <el-table-column label="客户单位"></el-table-column>
          <el-table-column label="消费金额"></el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        time: ''
      },
      list: []
    }
  },
  activated() {
    this.getLineData();
    this.getBarData();
  },
  methods: {
    // 折线图数据
    getLineData() {
      let ele = document.getElementById('lineEchart');
      let myChart = echarts.init(ele);
      let option = this.lineEcharts({
        lineData: [12, 32, 52, 14, 79, 42, 21, 54, 53, 21, 34, 13]
      });
      myChart.setOption(option);

      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },
    // 折线图配置
    lineEcharts(data) {
      let option = {
        title: {
          text: '会议室营收统计'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '15%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        color: ['#92B3E9'],
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        yAxis: {
          name: '单位/元',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        series: [{
          name: '营收统计费用',
          data: data.lineData,
          type: 'line',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#A8C1ED" },
                { offset: 1, color: "#DCE8FC" }
              ])
            }
          },
          itemStyle: { normal: { label: { show: true } } }
        }]
      };
      return option;
    },
    // 柱形图配置
    barEcharts(data) {
      let option = {
        title: {
          text: '各会议室营收统计',
          x: 'left',
          textAlign: 'left',
          // top: '1%'
        },
        color: ['#75C5A0'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        backgroundColor: '#fff',
        xAxis: {
          type: 'category',
          data: data.nameList,
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '单位/元',
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        series: data.valueList,
      };
      return option;
    },
    // 柱形图数据
    getBarData() {
      let ele = document.getElementById('barEchart');
      let myChart = echarts.init(ele);
      let option = this.barEcharts({
        nameList: ['种类1', '种类2', '种类3', '种类4', '种类5'],
        valueList: [
          {
            name: '各会议室营收统计',
            type: 'bar',
            stack: '1',
            barMaxWidth: 60,
            data: [49, 28, 34, 62, 20],
            label: {
              normal: {
                show: true,
                position: 'top',
                color: ['#000']
              }
            },
          }
        ]
      });
      myChart.setOption(option);
      // window.onresize = myChart.resize;

      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },
    getDataRequest() {

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
}
</script>

<style scoped lang="scss">
.pic-num-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  .picNum {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 33%;
  }
}

</style>
