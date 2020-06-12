<template>
  <div>

    <div class="h-table">
      <div class=" f-pull-right search-group">
        <el-radio-group v-model="activeName" @change="getClick" size="small" style="margin-right:10px;">
          <el-radio-button label="数量">数量</el-radio-button>
          <el-radio-button label="面积">面积</el-radio-button>
        </el-radio-group>
      </div>
      <div class="f-clearfix"></div>
      <div id="Combarline" style="width: calc(100% - 20px); height: 450px;"> </div>
      <el-table :data="list" stripe style="width: auto" @sort-change="sortChange">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="useOrganName" label="单位名称">
          <template slot-scope="scope">
            <a @click="getOrganId(scope.row.useOrganId)">{{ scope.row.useOrganName || ''}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="useRoomNum" label="房间数量" sortable='custom'>
          <template slot-scope="scope">
            {{ scope.row.useRoomNum || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="useAreaSum" label="使用面积（㎡）" sortable="custom">
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
import { constants } from 'fs';

export default {
  data() {
    return {
      activeName: '数量',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      dateCreatedSort: '',//排序方式 ASC/DESC
      orderBy: '',//排序方式 ASC/DESC
      // courtyardId: '', //院落id
      useOrganId: '', //使用单位id
      useOrganName: '',//使用单位名称
      useRoomNum: '',//使用单位数量
      useAreaSum: '',//使用单位面积
      list: [], //表格列表信息
      mybarlineChart: {}, // 使用单位图表      
      option: {
        color: ['#4b7efe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '3%',
          right: '4%',
          containLabel: true
        },
        Color: ['#4b7efe'],
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 60
        }, {
          start: 50,
          end: 100,
          xAxisIndex: [0],
          // height: 20, //组件高度
          right: 30, //右边的距离
          bottom: 5, //右边的距离
          handleSize: '80%'
        }],
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '30%',
            data: []
          }
        ],
      }

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
    this.mybarlineChart.setOption(this.option);
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
        if (this.activeName == '数量') {
          this.option.series[0].name = '数量'
          this.option.series[0].data = organNumList || '';
        } else {
          this.option.series[0].data = organAreaList || '';
          this.option.series[0].name = '面积'
        }
        this.option.xAxis[0].data = organNamelist || '';
        this.mybarlineChart.setOption(this.option);
        this.getDataRequest();
      })
    },
    getClick() {
      this.getCombarlinedata()
    },
    // 更新排序
    sortChange(column, prop, order) {
      if (column.prop === 'useRoomNum') {
        if (column.order === 'descending') {
          // ASC正序
          this.orderBy = 'orderNumByAsc';
        } else if (column.order === 'ascending') {
          // DESC倒序
          this.orderBy = 'orderNumByDesc';
        }
        else {
          this.orderBy = "";
        }
      } else if (column.prop === 'useAreaSum') {
        if (column.order === 'descending') {
          // ASC正序
          this.orderBy = 'orderAreaByAsc';
        } else if (column.order === 'ascending') {
          // DESC倒序
          this.orderBy = 'orderAreaByDesc';
        }
        else {
          this.orderBy = "";
        }
      } else {
        this.orderBy = "";
      }

      this.getDataRequest();

    },

    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        orderBy: this.orderBy,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.yardSearch_organList, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
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
        } else {
          this.list = [];
        }
      });
    },
    getOrganId(organId) {
      this.$store.dispatch('organIdActions', organId);
      this.$router.push({ path: '/basic-information/query-manage/query-company-list/addressnum', query: { formPage: 'courtyardOrgan' } })
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
