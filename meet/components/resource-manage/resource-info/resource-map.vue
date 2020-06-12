<template>
  <div class="wrap clear">
    <!-- 左侧地图部分 -->
    <div class="over-wrap fl">
      <div class="anhui-wrap"><span class="vertical"></span>安徽省</div>
      <div id="myChart" class="ah-chart"></div>
    </div>
    <!-- 右侧表格部分 -->
    <div class="right-table fr">
      <div class="all-province">
        <span class="vertical"></span>全省
        <span class="all-num">122</span>

        <!-- 下拉选项 -->
        <span class="all-type">类型：</span>
        <el-select class="all-sel" size="small" v-model="typeName" placeholder="请选择" @change="getPointData">
          <el-option class="all-option" v-for="(item, index) in typeMap" :key="index" :label="item" :value="index">
          </el-option>
        </el-select>

        <div class="table-wrap">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="areaName" label="地区" width="180">
            </el-table-column>
            <el-table-column prop="total" label="数量" width="180">
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mapData: [],
      typeMap: {
        HOTEL: '酒店',
        MEETING: '会议室',
        POINT: '视察点'
      },
      areaId: '0100102',
      typeName: 'HOTEL', // 下拉选项默认值
      tableData: [],
    };
  },
  activated() {
    // this.getDataRequest();
    // this.getSelectRequest();
  },
  mounted() {
    this.getPointData();
    this.getAreaFacade();
    this.getMapData();
  },
  computed: {
    // listTableListBol() {
    //   return this.$store.state.listTableListBol.tableListBol[
    //     "COURTYARD_INFO"
    //   ];
    // }

  },
  methods: {
    getAreaFacade() { //查询省会下所有地级市信息接口
      let params = {
        areaId: this.areaId
      }
      this.$axiosPost(API.sysAreaFacade_findAreaById, params).then(res => {
        this.areaNameList = res.model.list;
      })
    },
    getPointData() { //各个地级市对于酒店、会议室、视察点的统计
      let params = {
        areaId: this.areaId,
        type: this.typeName
      }
      this.$axiosPost(API.receptionFacade_findTotalByAreaId, params).then(res => {
        let list = [];
        setTimeout(() => {
          this.areaNameList.forEach((itemI, indexI) => {
            let isHasData = false;
            res.model.list.forEach((itemJ, indexJ) => {
              if (itemJ.areaId === itemI.areaId) {
                isHasData = true;
              }
            })
            if (!isHasData) {
              list.push({
                total: 0,
                areaName: itemI.areaName,
                areaId: itemI.areaId
              })
            }
          })
          this.tableData = res.model.list.concat(list);
        }, 2000)
      })
    },
    getMapData() {
      let params = {
        areaId: this.areaId
      }
      this.$axiosPost(API.receptionFacade_findTotalGroupByAreaId, params).then(res => {
        this.mapData = res.model;
        this.overviewCharts();
      })
    },
    // echarts
    overviewCharts() {
      // axios.get('https://pic.icar56.com/gov/json/anhui.json').then(response => {
      axios.get('../../../china-main-city/安徽.json').then((response) => {
        echarts.registerMap('安徽', response.data);
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
        let maxNum = Math.max(...maxNumList)
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
            max: maxNum,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [1],
            inRange: {
              color: ['#C6D8E5', '#4C85B0']
            }
          },
          geo: { // 这个是重点配置区
            map: '安徽', // 表示安徽地图
            roam: true,
            zoom: 1.15,
            scaleLimit: { min: 1.15, max: 1.15 },
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0,0.4)'
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
              name: '安徽', // 浮动框的标题
              type: 'map',
              map: '安徽',
              mapType: 'anhui',
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
// 左侧地图
.over-wrap {
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
.all-sel .el-input {
  // width: 70%;
}
.table-wrap .el-table,
.el-table th,
.el-table tr {
  background-color: #f8f8f8;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px;
}
.el-table::before {
  height: 0;
}
.el-table__header tr,
.el-table__header th {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.el-table__header th {
  width: 200px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 34px;
  color: #606266;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
}

.fl {
  float: left;
}
.fr {
  float: right;
}
.clear:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clear {
  zoom: 1;
}
</style>
