<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['预约统计']"></zl-breadcrumb>
      </div>
      <div class="picNum">
        <img
          class="f-inline-block"
          style="margin-top: -45px;"
          :src="$store.state.imgPath.iconStatistic"
        />
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">{{meetingApplyCountTotal}}</span>
          <span class="f-block" style="font-size:16px;">年度预约次数统（次）</span>
        </span>
      </div>
      <div class="picNum">
        <img
          class="f-inline-block"
          style="margin-top: -45px;"
          :src="$store.state.imgPath.iconStatistic"
        />
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">{{meetingApplyCountTotal}}</span>
          <span class="f-block" style="font-size:16px;">月度预约次数统（次）</span>
        </span>
      </div>
      <div class="picNum">
        <img
          class="f-inline-block"
          style="margin-top: -45px;"
          :src="$store.state.imgPath.iconStatistic"
        />
        <span class="f-inline-block" style="margin-left:20px;">
          <span class="f-block f-weight-bold" style="font-size:36px;">{{meetingApplyCountTotal}}</span>
          <span class="f-block" style="font-size:16px;">历史预约次数统（次）</span>
        </span>
      </div>

      <div>
        <div class="f-relative" style="z-index: 10; padding: 30px 0 10px;">
          <!-- 查询条件部分 -->
          <div class="m-search">
            <zl-searchLayout @click="getDataRequestSearch">
              <el-form-item label="时间">
                <el-date-picker v-model="search.time" type="year" placeholder="选择年"></el-date-picker>
              </el-form-item>
            </zl-searchLayout>
          </div>
        </div>
        <!--会议室预约次数总计 折线图 -->
        <div id="lineEchart" style="width:100%;height:400px;"></div>
        <!--各会议室预约次数 柱形图 -->
        <div id="barEchart" class="f-inline-block" style="width:60%;height:400px;margin-top:20px;"></div>
        <!--预计时长 饼图 -->
        <div id="pieEchart" class="f-inline-block" style="width:40%;height:400px;margin-top:20px;"></div>
      </div>
      <!-- 客户预约次数Top10 -->
      <!-- <div class="h-table f-relative" style="margin-top:40px;">
        <div class="f-weight-bold" style="font-size:16px;margin-bottom:20px;">客户预约次数Top10</div>
        <el-table :data="topTotalList" stripe style="width: 100%">
          <el-table-column label="序号" width="55px"
             type="index">
          </el-table-column>
          <el-table-column label="客户单位" prop="name"></el-table-column>
          <el-table-column label="预约次数" prop="count"></el-table-column>
        </el-table>
      </div>-->
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meetingApplyCountTotal: "", // 年度预约次数统计（次）
      meetingApplyCountLineData: [], // 会议室预约次数统计

      MeetingApplyCountTotal: [], //会议室预约次数总计原始数据格式
      MeetingApplyCountTotalList: [], //会议室预约次数总计数组数据格式
      MeetingApplyCountX: [], //会议室预约统计X轴数据
      MeetingApplyCountY: [], //会议室预约统计Y轴数据

      RoomCountTatal: [], //各会议室预约次数原始数据格式
      RoomCountTatalList: [], //各会议室预约次数数组数据格式
      RoomCountX: [], //各会议室预约次数X轴数据
      RoomCountY: [], //各会议室预约次数Y轴数据

      topTotal: [], //客户预约次数排行榜原始数据
      topTotalList: [], //客户预约次数排行榜数组数据

      search: {
        time: ""
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: []
    };
  },
  activated() {
    // this.search.time = DATE.currentDate();
    this.search.time = new Date();
    this.getBarData();
    this.getPieData();
    this.getOrganMeetingApplyCountByYear();
    this.getAppointTotleByYear();
    // this.getLineData();
    this.getAppointRoomTotleByYear();
    this.getAppointDeptTotleByYear();
  },
  methods: {
    // 折线图数据
    getLineData() {
      let ele = document.getElementById("lineEchart");
      let myChart = echarts.init(ele);
      let option = this.lineEcharts({
        lineData: this.MeetingApplyCountY
      });
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.MeetingApplyCountTotal = []; //会议室预约次数总计原始数据格式
      this.MeetingApplyCountTotalList = []; //会议室预约次数总计数组数据格式
      this.MeetingApplyCountX = []; //会议室预约统计X轴数据
      this.MeetingApplyCountY = []; //会议室预约统计Y轴数据
    },
    // 折线图配置
    lineEcharts(data) {
      let option = {
        title: {
          text: "会议室预约次数总计"
        },
        grid: {
          left: "1%",
          right: "1%",
          top: "15%",
          bottom: "10%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        color: ["#92B3E9"],
        xAxis: {
          type: "category",
          data: this.MeetingApplyCountX,
          boundaryGap: false
        },
        yAxis: {
          name: "月份/次",
          type: "value"
        },
        series: [
          {
            name: "会议室预约次数统计",
            data: this.MeetingApplyCountY,
            type: "line",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#A8C1ED" },
                  { offset: 1, color: "#DCE8FC" }
                ])
              }
            },
            itemStyle: { normal: { label: { show: true } } }
          }
        ]
      };
      return option;
    },
    // 柱形图配置
    barEcharts(data) {
      let option = {
        title: {
          text: "各部门预约次数",
          x: "left",
          textAlign: "left"
          // top: '1%'
        },
        color: ["#75C5A0"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true
        },
        backgroundColor: "#fff",
        xAxis: {
          type: "category",
          data: data.nameList,
          axisLine: {
            lineStyle: {
              color: "#9a9a9a"
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: "value",
          name: "单位/次",
          axisLine: {
            lineStyle: {
              color: "#9a9a9a"
            }
          }
        },
        series: data.valueList
      };
      return option;
    },
    // 柱形图数据
    getBarData() {
      let ele = document.getElementById("barEchart");
      let myChart = echarts.init(ele);
      let option = this.barEcharts({
        nameList: this.RoomCountX,
        valueList: [
          {
            name: "各部门预约次数",
            type: "bar",
            stack: "1",
            barMaxWidth: 60,
            data: this.RoomCountY,
            label: {
              normal: {
                show: true,
                position: "top",
                color: ["#000"]
              }
            }
          }
        ]
      });
      myChart.setOption(option);
      // window.onresize = myChart.resize;
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.RoomCountTatal = []; //各会议室预约次数原始数据格式
      this.RoomCountTatalList = []; //各会议室预约次数数组数据格式
      this.RoomCountX = []; //各会议室预约次数X轴数据
      this.RoomCountY = []; //各会议室预约次数Y轴数据
    },
    // 饼图数据
    getPieData() {
      let ele = document.getElementById("pieEchart");
      let myChart = echarts.init(ele);
      myChart.setOption({
        title: {
          text: "预约时长统计",
          x: 0
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          bottom: 50
        },
        series: [
          {
            name: "预约时长统计",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "省管局" },
              { value: 310, name: "区管局" },
              { value: 234, name: "市管局" },
              { value: 135, name: "省政府" },
              { value: 1548, name: "市公安局" }
            ]
          }
        ]
      });
      // window.onresize = myChart.resize;
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 年度预约次数统计（次）
    getOrganMeetingApplyCountByYear() {
      let params = {
        year: this.search.time.getFullYear()
      };
      this.$axiosGet(
        API.meetingRoomStatistics_toOrganSelfMeetingApplyCountByYear,
        params
      ).then(res => {
        // console.log('res',JSON.stringify(res))
        if (res.status === 200) {
          if (JSON.stringify(res.data) !== "{}") {
            this.meetingApplyCountTotal = res.data;
          }
        }
      });
    },
    // 会议室预约次数统计
    getAppointTotleByYear() {
      let params = {
        year: this.search.time.getFullYear()
      };
      this.$axiosGet(API.statisticAnalysis_appointTotleByYear, params).then(
        res => {
          if (res.status === 200) {
            if (JSON.stringify(res.data) !== "{}") {
              this.MeetingApplyCountTotal = [];
              this.MeetingApplyCountTotal = res.data;
              for (let list in this.MeetingApplyCountTotal) {
                let listData = {
                  id: this.MeetingApplyCountTotal[list].id,
                  name: this.MeetingApplyCountTotal[list].name,
                  count: this.MeetingApplyCountTotal[list].count,
                  totle: this.MeetingApplyCountTotal[list].totle
                };
                this.MeetingApplyCountTotalList.push(listData);
              }
              this.MeetingApplyCountTotalList.forEach(item => {
                this.MeetingApplyCountX.push(item.name);
                this.MeetingApplyCountY.push(item.totle);
              });
            }
            this.getLineData();
          }
        }
      );
    },
    // 各部门预约次数
    getAppointRoomTotleByYear() {
      let params = {
        year: this.search.time.getFullYear()
      };
      this.$axiosGet(
        API.meetingRoomStatistics_applySelfTotleByYear,
        params
      ).then(res => {
        if (res.status === 200) {
          this.RoomCountTatal = res.data;
          if (JSON.stringify(res.data) !== "{}") {
            for (let list in this.RoomCountTatal) {
              let listData = {
                id: this.RoomCountTatal[list].id,
                name: this.RoomCountTatal[list].name,
                count: this.RoomCountTatal[list].count,
                totle: this.RoomCountTatal[list].totle
              };
              this.RoomCountTatalList.push(listData);
            }
            this.RoomCountTatalList.forEach(item => {
              this.RoomCountX.push(item.name);
              this.RoomCountY.push(item.totle);
            });
          }
          this.getBarData();
        }
      });
    },
    // 客户预约次数排行榜
    getAppointDeptTotleByYear() {
      let params = {
        year: this.search.time.getFullYear()
      };
      this.$axiosGet(API.statisticAnalysis_appointDeptTotleByYear, params).then(
        res => {
          if (res.status === 200) {
            if (JSON.stringify(res.data) !== "{}") {
              this.topTotal = res.data;
              for (let list in this.topTotal) {
                let listData = {
                  id: this.topTotal[list].id,
                  name: this.topTotal[list].name,
                  count: this.topTotal[list].count,
                  totle: this.topTotal[list].totle
                };
                this.topTotalList.push(listData);
              }
            }
          }
        }
      );
    },
    // 按年查询数据
    getDataRequestSearch() {
      this.getOrganMeetingApplyCountByYear();
      this.getAppointTotleByYear();
      this.getAppointRoomTotleByYear();
      this.getAppointDeptTotleByYear();
    },

    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>

<style>
.picNum{
  display: inline-block;
  width: 33%;
  margin-top:28px
}
</style>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                