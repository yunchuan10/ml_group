<template>
  <div id="home">
    <section class="m-main">
      <div class="over-wrap f-pull-left">
        <div class="anhui-wrap">
          <span class="vertical"></span>{{this.areaName}}</div>
        <div id="myChart" class="ah-chart"></div>
      </div>
      <!-- 右侧表格部分 -->
      <div class="right-table f-pull-right">
        <div class="all-province">
          <span class="vertical"></span>{{this.areaName}}党政机关经营性房产情况汇总

          <!-- 下拉选项 -->
          <!-- <span class="all-type">类型：</span>
          <el-select class="all-sel" size="small" v-model="typeName" placeholder="请选择" @change="getPointData">
            <el-option class="all-option" v-for="(item, index) in typeMap" :key="index" :label="item" :value="index">
            </el-option>
          </el-select> -->

          <div class="table-wrap">
            <el-table :data="tableData" style="width: 100%;  height: 650px; overflow-y:auto;" show-summary>
              <el-table-column prop="areaName" label="地区" width="120">
                <template slot-scope="scope">
                  <router-link :to="{path:'/operate/homemap/map-courtyard', query: {areaId:scope.row.areaId,areaType: scope.row.areaType}}">{{ scope.row.areaName}}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="totalHouseNum" label="房屋数量（处）">
              </el-table-column>
              <el-table-column prop="totalBuildArea" label="总建筑面积（㎡）">
              </el-table-column>
              <el-table-column prop="totalRentingNum" label="出租中（处）" width="120">
              </el-table-column>
            </el-table>
          </div>

        </div>
      </div>
      <div class="f-clearfix"></div>
    </section>
  </div>

</template>

<script>
// import echarts from 'echarts';
import axios from 'axios';
export default {
  data() {
    return {
      mapData: [],
      area: '', //地区
      typeMap: {
        yard: '按院落',
        organ: '按单位',
      },
      typeName: 'yard', // 下拉选项默认值
      tableData: [],
      areaType: '', //判断是省直还是地区

    };
  },
  activated() {
    setTimeout(() => {
      this.overviewCharts();
    }, 500);
    this.getMapData();
  },
  // mounted() {
  //   this.getMapData();
  // },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    areaLevel() {
      return this.$store.state.mainData.areaLevel;
    }
  },
  watch: {
    'areaId': function (val) {
      this.areaName();
      this.getMapData();
    }
  },
  methods: {
    getPointData() {
      this.getMapData();
    },
    getMapData() {
      let params = {
        areaId: this.areaId
      }
      this.$axiosPost(API.mainPage_getMainPageData, params).then(res => {
        if (res.data) {
          let list = res.data.mainPageResponseList;
          this.tableData = list;
          this.mapData = res.data.mapData;
        }
      })

    },
    // echarts
    overviewCharts() {
      let url = '';
      url = `${process.env.BASE_URL}chinaMainCity/${this.areaId}.json`;
      axios.get(url).then((response) => {
        echarts.registerMap(this.areaName, response.data);
        let maxNumList = []; // 设置最大数
        let data = [];
        if (this.mapData.length > 0) {
          this.mapData.forEach((item, index) => {
            let count = 0;
            item.data.forEach((list, listIndex) => {
              count += Number(list.value)
            })
            maxNumList.push(count);
            data.push({
              name: item.name,
              value: count
            })
          })
        }
        // let maxNum = Math.max(...maxNumList)
        let myChart = echarts.init(document.getElementById('myChart'));
        window.onresize = myChart.resize;
        myChart.setOption({ // 进行相关配置
          tooltip: {
            formatter: (params) => {
              // debugger
              var toolTiphtml = ''
              if (this.mapData.length > 0) {
                this.mapData.forEach((item, index) => {
                  if (params.name == item.name) {
                    toolTiphtml += `${item.name}<br>`
                    item.data.forEach((list, listIndex) => {
                      toolTiphtml += `${list.name}：${list.value}<br>`
                    })
                  }

                })
                return toolTiphtml;
              } else {
                return ''
              }
            }
          }, // 鼠标移到图里面的浮动提示框
          dataRange: {
            show: true,
            min: 0,
            // max: maxNum,
            max: 10,
            left: 20,
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [1],
            inRange: {
              color: ['#C6D8E5', '#4C85B0']
            }
          },
          geo: { // 这个是重点配置区
            map: this.areaName, // 表示云南地图
            roam: true,
            zoom: 1.15,
            scaleLimit: { min: 1.15, max: 1.15 },
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: '#303133',
                  fontWeight: '700'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo' // 对应上方配置
            },
            {
              name: this.areaName, // 浮动框的标题
              type: 'map',
              map: this.areaName,
              mapType: this.areaName,
              geoIndex: 0,
              data: data
            }
          ]
        })
      })
    }
  }
};
</script>

<style lang="scss">
#home {
  // 左侧地图
  .over-wrap {
    margin-top: 10px;
    width: 60%;
    background-color: #f8f8f8;
    border-radius: 4px;
  }
  .anhui-wrap,
  .all-province {
    padding: 26px 0 0 40px;
    font-size: 18px;
    font-weight: bold;
    color: #2e71ff;
  }
  .vertical {
    position: relative;
    top: 3px;
    right: 5px;
    width: 3px;
    height: 16px;
    display: inline-block;
    background-color: #2e71ff;
  }
  .ah-chart {
    width: 100%;
    height: 700px;
  }
  // 右侧表格
  .right-table {
    margin-top: 10px;
    width: 38.5%;
    background-color: #f8f8f8;
    border-radius: 4px;
    height: 750px;
  }
  .all-province {
    padding: 26px 0 0 10%;
  }
  .all-num {
    padding: 0 20px;
    font-size: 18px;
    font-weight: bold;
    color: #2e71ff;
  }
  // 类型
  .all-type {
    padding: 0 0 0 10%;
    color: #484848;
    font-size: 16px;
    font-weight: normal;
  }
  .all-sel {
    width: 100px;
  }
  .table-wrap {
    .el-table {
      background: none;
      tr {
        background: none;
        th {
          background: none;
        }
      }
    }
  }
  .table-cell {
    border-bottom: 0px;
    background-color: #f8f8f8;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 0px;
  }
  .el-table::before {
    height: 0;
  }
  .el-table__header th {
    width: 200px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 34px;
    color: #606266;
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
