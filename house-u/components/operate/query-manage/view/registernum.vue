<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div id="mainbar" name='num' style="width: calc(100% - 20px); height: 400px;">
        </div>
      </div>
      <div class="u-grid-table">
        <el-table :data="list" stripe style="width: auto">
          <el-table-column fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="warrantSituation" label="产权办理情况">
            <template slot-scope="scope">
              <a @click="ownershipDetailInfoClick(scope.row.ownershipFirstId, scope.row.warrantSituation)">{{ scope.row.warrantSituation}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="propertyOrganName" label="产权单位"></el-table-column>
          <el-table-column prop="houseLocation" label="房屋地址"></el-table-column>
          <el-table-column prop="houseArea" label="房屋面积（㎡）"></el-table-column>
          <el-table-column prop="landArea" label="宗地面积（㎡）"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="h-table-bottom">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 详情弹出框 -->
    <!-- <ownership-detail ref="ownershipDetail"></ownership-detail> -->
  </div>
</template>

<script>
// import ownershipDetail from '@/components/basic-information/ownership-manage/ownership-detail'; // 详情弹出框
export default {

  components: {
    // 'ownership-detail': ownershipDetail,
  },
  data() {
    return {
      activeName: '数量',
      filterText: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], //表格列表信息
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chatOptions: {
        title: [{
          text: '',
          textStyle: { fontSize: 16 },
          top: 10,
          left: 10,
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: '15%',
          data: ['仅办理房产证', '仅办理土地证', '已办理，且两证分离', '已办理，且两证合一'],
          textStyle: {
            color: '#3c434c'
          }
        },
        grid: {
          top: '30%',
          left: '4%',
          right: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#3c434c',
              interval: 0,
              // formatter: function (value) {
              //   return value.split("").join("\n");
              // }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e1e2e3'
              },
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '个数',
            minInterval: 1,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e1e2e3'
              },
            },
            axisTick: { show: false },
            splitLine: {
              show: true
            },
            axisLabel: {
              color: '#3c434c'
            }
          }

        ],
        color: ['#9f4ef1', '#ff704f', '#29cc97', '#fec400'],
        series: [
          {
            name: '仅办理房产证',
            type: 'bar',
            stack: '公房',
            data: [],
            barWidth: 30,
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [0, 0, 2, 2]
              }
            }
          },
          {
            name: '仅办理土地证',
            type: 'bar',
            stack: '公房',
            data: [],
            barWidth: 30,
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [2, 2, 0, 0]
              }
            }
          },
          {
            name: '已办理，且两证分离',
            type: 'bar',
            stack: '公房',
            data: [],
            barWidth: 30,
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [2, 2, 0, 0]
              }
            }
          },
          {
            name: '已办理，且两证合一',
            type: 'bar',
            stack: '公房',
            data: [],
            barWidth: 30,
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [2, 2, 0, 0]
              }
            }
          },
        ]
      },
      myChart1: {}
    }
  },
  activated() {
    this.myChart1 = echarts.init(document.getElementById('mainbar'));
    this.myChart1.setOption(this.chatOptions);
    this.getOwnerCount();
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    },
    organName() {
      return this.$store.state.mainData.organName;
    }
  },
  watch: {
    'courtyardId': function (val) {
      this.getOwnerCount();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 权属详情
    ownershipDetailInfoClick(id, transferStatus) {
      this.$refs.ownershipDetail.openModal(id, transferStatus);
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    getOwnerCount() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosPost(API.yardSearch_ownerCount, params).then(res => {
        this.chatOptions.xAxis[0].data = [this.organName, '其他单位'];
        this.chatOptions.series.forEach((item, index) => {
          item.data = [];
          if (res.data) {
            res.data.ogranProperty.forEach((itemI, indexI) => {
              if (item.name === itemI.situationName) {
                item.data.push(itemI.situationNum)
              }
            })
          }
          if (res.data) {
            res.data.noOgranProperty.forEach((itemJ, indexJ) => {
              if (item.name === itemJ.situationName) {
                item.data.push(itemJ.situationNum)
              }
            })
          }
        })
        this.myChart1.setOption(this.chatOptions);
        this.getList();
      })
      // 
    },
    // 获取列表数据
    getList() {
      let params = {
        courtyardId: this.courtyardId,
        propertyOrganName: '',
        warrantSituation: '',
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.ownershipFirst_queryList, params).then(res => {
        if (res.data) {
          this.total = res.data.total;
          let list = res.data.data;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.total = 0;
          this.list = [];
        }
      })

    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getList();
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
