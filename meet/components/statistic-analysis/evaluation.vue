<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['会务评价统计']"></zl-breadcrumb>
      </div>
      <div class="picNum">
        <img class="f-inline-block" style="margin-top: -45px;" :src="$store.state.imgPath.iconStatistic">
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">12</span>
          <span class="f-block" style="font-size:16px;">会务评价总次数（次）</span>
        </span>
      </div>
        <div class="picNum">
        <img
          class="f-inline-block"
          style="margin-top: -45px;"
          :src="$store.state.imgPath.iconStatistic"
        />
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">13%</span>
          <span class="f-block" style="font-size:16px;">评价率</span>
        </span>
      </div>
         <div class="picNum">
        <img
          class="f-inline-block"
          style="margin-top: -45px;"
          :src="$store.state.imgPath.iconStatistic"
        />
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">100%</span>
          <span class="f-block" style="font-size:16px;">好评率</span>
        </span>
      </div>

      <div>
        <div class="f-relative" style="z-index: 10;padding: 30px 0 10px">
          <!-- 查询条件部分 -->
          <div class="m-search">
            <zl-searchLayout @click="getDataRequest">
              <el-form-item label="时间">
                <el-select v-model="search.time" placeholder="请选择">
                  <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </zl-searchLayout>
          </div>
        </div>
        <!-- 柱形图 -->
        <div id="barEchart" class="f-inline-block" style="width:100%;height:400px;"></div>
      </div>

      <div class="h-table f-relative" style="margin-top:40px;">
        <div class="m-search">
          <zl-searchLayout @click="getDataRequest">
            <el-form-item label="星级">
              <el-select v-model="search.star" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in starOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </zl-searchLayout>
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55px"></el-table-column>
          <el-table-column label="订单号"></el-table-column>
          <el-table-column label="申请单位"></el-table-column>
          <el-table-column label="申请人"></el-table-column>
          <el-table-column label="预约使用时间"></el-table-column>
          <el-table-column label="会议名称"></el-table-column>
          <el-table-column label="客服经理"></el-table-column>
          <el-table-column label="星级"></el-table-column>
          <el-table-column label="操作"></el-table-column>
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
        time: '',
        star: ''
      },
      timeOptions: [
        {
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '最近一个月'
        }, {
          value: '2',
          label: '最近三个月'
        }, {
          value: '3',
          label: '最近半年'
        }
      ],
      starOptions: [
        {
          value: '1',
          label: '一星'
        }, {
          value: '2',
          label: '二星'
        }, {
          value: '3',
          label: '三星'
        }, {
          value: '4',
          label: '四星'
        }, {
          value: '5',
          label: '五星'
        }
      ],
      list: []
    }
  },
  activated() {
    this.getBarData();
  },
  methods: {
    // 柱形图配置
    barEcharts(data) {
      let option = {
        title: {
          text: '会务评价统计',
          x: 'left',
          textAlign: 'left',
          // top: '1%'
        },
        color: ['#75C5A0', '#4C4CF6', '#4B7EFE', '#E068CB', '#A77F4A'],
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
          name: '单位/台',
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
            name: '设备状态统计',
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

<style>
.picNum {
  display: inline-block;
  width: 33%;
  margin-top: 28px;
}
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                