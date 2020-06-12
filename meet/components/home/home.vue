<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="首页" ></zl-breadcrumb>
      </div>
      <div class="home-meet-menu">
        <ul class="home-menu-list">
          <li v-for="(item,index) in meetHomeMenuList" :key="index" :class="`sort${index}`">
            <span class="m-icon"><img :src="item.icon" class="item-icon"></span>
            <span class="m-text">
              <label class="name">{{item.name}}</label>
              <label class="count">{{item.count}}</label>
            </span>
          </li>
        </ul>
      </div>
      <div class="meet-user-condition">
        <img class="meet-room" :src="meetRoom" alt="会议室封面" width="160" height="90">
        <span class="m-text">
          <label class="name">会议室使用情况</label>
          <label class="count">当前使用率：60%</label>
        </span>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="50px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column label="位置" prop="area"></el-table-column>
          <el-table-column label="会议室" prop="meetRoom"></el-table-column>
          <el-table-column label="容纳人数" prop="count"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="scope.row.status === 0" type="success" size="medium" disable-transitions>空闲</el-tag>
              <el-tag class="el-tag-item" v-else-if="scope.row.status === 1" type="danger" size="medium" disable-transitions>占用</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="home-statistics ">
        <div class="home-statistics-item">
          <div id="lineEchart" style="width:100%;height:400px;"></div>
        </div>
        <div class="home-statistics-item">
          <div id="shadowEchart" style="width:100%;height:400px;"></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data(){
    return {
      meetHomeMenuList:[],
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
    }
  },
  activated(){
    this.meetHomeMenuList = [
      {icon: this.userGroupFill, name:'今日会议数量', count:7},
      {icon: this.paperPlaneFill, name:'进行中会议', count:5},
      {icon: this.edit, name:'待批审订单', count:15},
    ];
    this.list = [
      { area:'东一楼', meetRoom:'第一会议室', count:20, status:0 },
      { area:'西一楼', meetRoom:'第二会议室', count:50, status:1 },
      { area:'东二楼', meetRoom:'第三会议室', count:60, status:0 },
      { area:'西二楼', meetRoom:'第四会议室', count:100, status:1 },
    ];
    this.getLineData();
    this.getShadowData();
  },
  computed:{
    ...mapState('imgPath', [
      'meetRoom',
      'userGroupFill',
      'paperPlaneFill',
      'edit',
    ])
  },
  methods:{
    // 折线图数据
    getLineData() {
      let ele = document.getElementById('lineEchart');
      let myChart = echarts.init(ele);
      let option = this.lineEcharts({
        lineData: [14, 16, 15, 19, 16, 17, 21]
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
          text: '本周预约次数统计'
        },
        grid: {
          left: '1%',
          right: '1.5%',
          top: '20%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        color: ['#92B3E9'],
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        yAxis: {
          name: '单位/次',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#9a9a9a'
            }
          }
        },
        series: [{
          name: '预约次数统计',
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
    // 横向柱状图数据
    getShadowData() {
      let ele = document.getElementById('shadowEchart');
      let myChart = echarts.init(ele);
      let option = this.shadowEcharts({
        lineData: [14, 16, 15, 19, 16, 17, 21]
      });
      myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },
    // 横向柱状图配置
    shadowEcharts(data) {
      let option = {
        title: {
          text: '各时间段预约次数'
        },
        grid: {
          left: '1%',
          right: '1.5%',
          top: '20%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        color: ['#92B3E9'],
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          name: '单位/次',
          type: 'category',
          data: [ '滁州市财政局', '滁州市财政局', '滁州市财政局', '滁州市财政局', '滁州市发展和改革委员会'],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        series: [{
          name: '预约次数统计',
          data: data.lineData,
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color:'#75C5A0',
              label: {
                show: true,
                position: 'right',
                color: '#333333',
                fontSize: 14,
                offset: [10, 0]
              },
            }
          },


        }]
      };
      return option;
    },


  }

};
</script>

<style lang="scss">
.home-meet-menu{
  padding-top: 20px;
  .home-menu-list{
    display: flex;
    justify-content: space-between;
    li{
      display: flex;
      justify-content: left;
      width: 28%;
      height: 90px;
      padding: 1% 1.5%;
      border-radius: 8px;
      &.sort0{
        background:rgba(98,191,204,1);
      }
      &.sort1{
        background:rgba(230,134,140,1);
      }
      &.sort2{
        background:rgba(88,118,225,1);
      }
      .m-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        width:90px;
        height:90px;
        background:rgba(255,255,255,0.1);
        border-radius:20px;
        .item-icon{
          display: inline-block;
          width: 50px;
          height: 41px;
        }
      }
      .m-text{
        display: inline-block;
        width: 150px;
        padding-left: 5%;
        color: #fff;
        font-size: 20px;
        vertical-align: top;
        .name{
          display: inline-block;
          width: 100%;
          padding-top: 5px;
        }
        .count{
          display: inline-block;
          width: 100%;
          padding-top: 10px;
          font-size: 26px;
        }
      }
    }
  }
}
.meet-user-condition{
  display: flex;
  align-items: center;
  padding: 15px 0;
  .meet-room{
    border-radius: 6px;
  }
  .m-text{
    display: inline-block;
    padding-left: 20px;
    .name{
      display: inline-block;
      width: 100%;
      color: #303133;
      font-size: 18px;
      line-height: 32px;
    }
    .count{
      display: inline-block;
      padding-top: 10px;
      width: 100%;
      color: #4B65DE;
      font-size: 14px;
    }
  }
}
.el-tag-item {
  display: inline-block;
  width: 80px;
  text-align: center;
  border-radius: 12px;
}
.home-statistics {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .home-statistics-item{
    width: 46%;
    padding: 15px 20px;
    background:rgba(249,249,249,1);
    border-radius:8px;
    h3{
      color: #303133;
      font-size: 18px;
    }
  }
}
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                