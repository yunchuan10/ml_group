<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div class="u-grid-charttab">
          <el-radio-group v-model="activeName" @change="getSwitch" size="small">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group>
        </div>

        <div id="Usedpie" name='num' style="width: calc(100% - 20px); height: 400px;">
        </div>
      </div>

      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>房间状态</span>
                  <el-select v-model="useStatus" filterable placeholder="请选择房间状态">
                    <el-option label="全部" value=''></el-option>
                    <el-option v-for="(item, index) in useStatusList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <el-table :data="list" stripe style="width: auto">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="roomNo" label="房间号">
          <template slot-scope="scope">
            <a @click="roomDetailInfoClick(scope.row.roomId)">{{scope.row.roomNo}}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="roomBaseTypes" label="房间类型">
        </el-table-column> -->
        <el-table-column prop="roomAddress" label="房间位置" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userArea" label="使用面积（㎡）">
        </el-table-column>
        <el-table-column prop="useOrganName" label="使用单位">
        </el-table-column>
        <el-table-column prop="useStatusName" label="房间状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.useStatus)">{{scope.row.useStatusName || '—'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>

    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>

<script>
// import roomDetail from '@/components/basic-information/room-manage/room-detail'; // 详情弹出框
import { setTimeout } from 'timers';
export default {

  components: {
    // 'v-room-detail': roomDetail
  },
  data() {
    let self = this;
    return {
      activeName: '数量',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      // courtyardId: '',
      myChart1: {}, //车辆状态图表
      list: [],
      useStatus: '', // 查询框绑定的值
      useStatusList: [],
      roomStatusCountList: [], //房间状态数量集合
      chatOptions: {
        title: [{
          text: '办公用房总体使用情况',
          textStyle: { fontSize: 16 },
          top: 10,
          left: 10
        }],
        tooltip: {
          trigger: 'item',
          formatter: "{b}，{d}%"
        },
        legend: {
          orient: 'vertical',
          icon: 'rect',
          right: '10%',
          y: 'center',
          data: []
        },
        series: [{
          type: 'pie',
          radius: ['40%', '60%'],
          color: ['#66c33a', '#6bb0f7', '#a7b5e0', '#90b0a5', '#c3b98f', '#b19d9d', '#f66e6e', '#e7a33c'],
          data: [],
          label: {
            normal: {}
          }
        }]
      },
      roomNum: '0'
    };
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    }
  },
  watch: {
    'courtyardId': function (val) {
      this.getRoomCount();
    }
  },
  activated() {
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
    this.myChart1.setOption(this.chatOptions);
    this.getRoomCount();
    this.init();
  },
  mounted() {

  },
  deactivated() {
    // this.$destroy();
  },
  methods: {
    checkStatus(value) {
      if (value === 'IDLE') { // 闲置中
        return 's-state-success'
      } else if (value === 'INUSE') {
        return 's-state-prohibited'
      } else if (value === 'REMOVED' || value === 'AUCTIONED' || value === 'RENTED' || value === 'CONVERSIONPURPOSESED') {
        return 's-state-fail'
      } else if (value === 'HANDLEING') {
        return 's-state-prohibited'

      } else {
        return 's-state-caveat'
      }
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    getSwitch() {
      this.getRoomCount();
    },
    // 获取图表数据
    getRoomCount() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosPost(API.yardSearch_roomCount, params).then(res => {
        if (res.data) {
          this.roomNum = res.data.roomNum;
          this.roomStatusCountList = res.data.roomStatusCount || [];
          this.useStatusList = res.data.useStatus;
          let roomUseList = [];
          let legend = ['已分配', '闲置', '已拆除', '已拍卖', '已出租', '已转换用途', '处置中', '调配中'];
          if (this.roomStatusCountList.length > 0) {
            if (this.activeName === '数量') {
              this.roomStatusCountList.forEach((item, index) => {
                if (item.useStatus === 'INUSE') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已分配`
                  })
                } else if (item.useStatus === 'IDLE') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `闲置`
                  })
                } else if (item.useStatus === 'REMOVED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已拆除`
                  })
                } else if (item.useStatus === 'AUCTIONED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已拍卖`
                  })
                } else if (item.useStatus === 'RENTED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已出租`
                  })
                } else if (item.useStatus === 'CONVERSIONPURPOSESED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已转换用途`
                  })
                } else if (item.useStatus === 'HANDLEING') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `处置中`
                  })
                } else if (item.useStatus === 'OFFICEHOUSEAPPLYING') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `调配中`
                  })
                }
              })
            } else {
              this.roomStatusCountList.forEach((item, index) => {
                if (item.useStatus === 'INUSE') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `已分配`
                  })
                } else if (item.useStatus === 'IDLE') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `闲置`
                  })
                } else if (item.useStatus === 'REMOVED') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `已拆除`
                  })
                } else if (item.useStatus === 'AUCTIONED') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `已拍卖`
                  })
                } else if (item.useStatus === 'RENTED') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `已出租`
                  })
                } else if (item.useStatus === 'CONVERSIONPURPOSESED') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `已转换用途`
                  })
                } else if (item.useStatus === 'HANDLEING') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `处置中`
                  })
                } else if (item.useStatus === 'OFFICEHOUSEAPPLYING') {
                  roomUseList.push({
                    value: item.areaSum || '0',
                    name: `调配中`
                  })
                }
              })
            }
          }
          this.chatOptions.series[0].data = roomUseList || [];
          this.chatOptions.legend.data = legend;
          this.$set(this.chatOptions.legend, 'formatter', this.getLengendForMatter);
          this.$set(this.chatOptions.series[0].label.normal, 'formatter', this.setForMatter);
          this.myChart1.setOption(this.chatOptions); //this.options为车辆状态的配置
        } else {
          this.roomStatusCountList = [];
          // this.chatOptions.series[0].data = [];
        }
        this.getTableData();
      })
    },
    setForMatter(params, ticket, callback) {
      let total = 0; //办公用房总面积
      let percent = 0; //办公用房占比
      this.chatOptions.series[0].data.forEach((item, index) => {
        total += Number(item.value);
      });
      percent = ((params.value / total) * 100).toFixed(2);
      if (isNaN(percent) || percent === '0.00') {
        return `${params.name}：0%`;
      }
      return `${params.name}：${percent}%`;
    },
    getLengendForMatter(name) {
      let value = '';
      this.chatOptions.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        if (this.activeName === '数量') {
          return `${name}：${value}间`;
        } else {
          return `${name}：${value}㎡`;
        }
      }
    },
    getSearch() {
      this.page = 1;
      this.getTableData();
    },

    getTableData() {
      let params = {
        courtyardId: this.courtyardId,
        useStatus: this.useStatus || '',
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.yardSearch_roomList, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    // 详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getTableData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getTableData();
    }

  },

};
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 80%;
}
</style>
<style lang="scss" scoped>
.h-table {
  float: left;
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
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 12%;
    top: 15%;
  }
}
</style>
