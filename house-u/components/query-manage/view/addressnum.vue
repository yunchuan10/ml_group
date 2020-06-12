<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div class="u-grid-tooltip">
          <el-tooltip class="item u-grid-tips" effect="dark" content="当房间存在多用途使用时，部分房间会被多次计算，请以房间列表为准。" placement="right-start">
            <i class="iconfont icon-gantanhao"></i>
          </el-tooltip>
        </div>
        <div class="u-grid-charttab">
          <el-radio-group v-model="activeName" @change="getRoomCount" style="margin-bottom: 30px;" size="small">
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
                  <span>房间位置</span>
                  <el-select v-model="search.roomAddress" filterable clearable placeholder="请选择房间类型">
                    <el-option v-for="item in floorAndStoreys" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>房间类型</span>
                  <el-cascader :options="roomTypeList" v-model="search.houseType" filterable clearable placeholder="请选择房间类型">
                  </el-cascader>
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
      <el-table :data="list" stripe style="width: auto;margin-top: 10px" reserve-selection>
        <el-table-column label="序号" prop="xuhao" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="roomNo" label="房间号">
          <template slot-scope="scope">
            <a @click="roomDetailInfoClick(scope.row.roomId)">{{scope.row.roomNo}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="roomBaseTypes" label="房间类型">
        </el-table-column>
        <el-table-column prop="roomName" label="房间名称">
        </el-table-column>
        <el-table-column prop="userArea" label="使用面积（㎡）">
        </el-table-column>
        <el-table-column prop="useClientStatusName" label="使用状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.useClientStatusName)">{{scope.row.useClientStatusName || '—'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roomAddress" label="房间位置">
        </el-table-column>
        <el-table-column prop="useUserNum" label="使用人数">
        </el-table-column>
        <el-table-column label="当前使用人">
          <template slot-scope="scope">
            <a v-for="(item,index) in scope.row.useUsers" :key="index">
              <span v-show="index > 0">，</span>{{ item.realName }}
            </a>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="operation" label="操作">
          <template slot-scope="scope">
            <a @click="useAllocationClick(scope.row.roomId)" v-show="scope.row.useClientStatusName === '空置'">分配</a>
            <a @click="useAllocationClick(scope.row.roomId)" v-show="scope.row.useClientStatusName === '在用'">修改</a>
            <a @click="roomDetailInfoClick(scope.row.roomId)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <v-allocation ref="allocation" @requestData="getTableData"></v-allocation>
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import allocation from '@/components/query-manage/view/allocation'; // 使用分配
import roomDetail from '@/components/query-manage/view/room-detail'; // 详情弹出框
export default {
  components: {
    'v-allocation': allocation,
    'v-room-detail': roomDetail
  },
  data() {
    let self = this;
    return {
      search: {
        roomStatus: '', // 查询框绑定的值
        houseType: [], // 房间类型绑定的值
        roomAddress: '', // 房间位置
      },
      activeName: '数量',
      filterText: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      selectedOption: '', //院落默认选中一项
      courtyardList: [], //院落集合
      houseUseStatusList: [], //房间使用状态集合
      roomTypeList: [], // 房间类型集合
      roomTypeCountList: [], //获取图表集合     
      myChart1: {}, //车辆状态图表
      floorAndStoreys: [], //楼层和楼座信息
      multipleSelection: [], // 选中的列数
      list: [],
      region: '',
      chatOptions: {
        title: [{
          text: '',
          textStyle: { fontSize: 16 },
          top: 10,
          left: 10
        }],
        tooltip: {
          trigger: 'item',
          formatter: "{b}：{d}%"
        },
        legend: {
          orient: 'vertical',
          icon: 'rect',
          right: '10%',
          y: 'center',
          data: ['附属用房', '设备用房', '空置用房', '办公室', '服务用房', '技术用房']
        },
        series: [{
          type: 'pie',
          radius: ['40%', '60%'],
          color: ['#ffd016', '#409eff', ' #b069f8', '#584cd8', '#00b875', '#ff6400'],
          data: [],
          label: {
            normal: {}
          }
        }]
      },
      roomListData: []
    };
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    }
  },
  watch: {
    'courtyardId': function (val) {
      this.search.roomAddress = '';
      this.getRoomCount();
      this.getTableData();
    }
  },
  activated() {
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
    this.myChart1.setOption(this.chatOptions);
    this.getRoomCount();
    this.getTableData();
  },
  mounted() {
    this.init();
  },
  deactivated() {

  },
  methods: {
    setDisabled(row, index) {
      if (row.houseStatus === '在用') {
        return false
      } else {
        return true
      }
    },
    useAllocationClick(id) {
      this.$refs.allocation.openModal(id);
    },
    checkStatus(value) {
      if (value === '空置') {
        return 's-state-success'
      } else if (value === '在用') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    // 图表大小自适应
    init() {
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    // 获取图表数据
    getRoomCount() {
      let params = {
        courtyardId: this.courtyardId,
      }
      this.$axiosPost(API.useSummary_getEchartData, params).then(res => {
        if (res.data) {
          this.roomTypeCountList = res.data.roomTypeCountList;
          this.floorAndStoreys = res.data.floorAndStoreys;
        } else {
          this.roomTypeCountList = [];
          this.floorAndStoreys = [];
        }
        let roomUseList = [];
        let legend = [];
        let room = 0;
        let area = 0;
        if (this.activeName === '数量') {
          this.roomTypeCountList.forEach((item, index) => {
            room += item.roomNum;
            area += item.useAreaSum;
            switch (item.roomTypeId) {
            case 'AFFILIATEDHOUSE':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `附属用房`
                }
              )
              break;
            case 'EQUIPHOUSE':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `设备用房`
                }
              )
              break;
            case 'TYPENULL':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `空置用房`
                }
              )
              break;
            case 'OFFICEHOUSE':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `办公室`
                }
              )
              break;
            case 'SERVICEHOUSE':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `服务用房`
                }
              )
              break;
            case 'TECHHOUSE':
              roomUseList.push(
                {
                  value: item.roomNum || '0',
                  name: `技术用房`
                }
              )
              break;
            }
          });
        }
        else {
          this.roomTypeCountList.forEach((item, index) => {
            switch (item.roomTypeId) {
            case 'AFFILIATEDHOUSE':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `附属用房`
                }
              )
              break;
            case 'EQUIPHOUSE':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `设备用房`
                }
              )
              break;
            case 'TYPENULL':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `空置用房`
                }
              )
              break;
            case 'OFFICEHOUSE':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `办公室`
                }
              )
              break;
            case 'SERVICEHOUSE':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `服务用房`
                }
              )
              break;
            case 'TECHHOUSE':
              roomUseList.push(
                {
                  value: item.useAreaSum || '0',
                  name: `技术用房`
                }
              )
              break;
            }
          });
        }
        let roomName = [];
        roomUseList.forEach((item, index) => {
          roomName.push(item.value);
        })
        this.chatOptions.series[0].data = roomUseList || [];
        this.$set(this.chatOptions.legend, 'formatter', this.getLengendForMatter);
        this.$set(this.chatOptions.series[0].label.normal, 'formatter', this.setForMatter);
        this.myChart1.setOption(this.chatOptions); //this.chatOptions为房间类型分类
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
    //获取列表信息
    getTableData() {
      let params = {
        courtyardId: this.courtyardId,
        floorId: this.search.roomAddress || '',
        roomTypeIds: JSON.stringify(this.search.houseType), //房间使用类型,
        useClientStatus: this.search.roomStatus,
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.useSummary_roomList, params).then(res => {
        if (res.data) {
          this.houseUseStatusList = res.data.useClientStatusList;
          this.roomTypeList = res.data.roomTypeList;
          let list = [];
          list = res.data.roomList.data || [];
          this.total = res.data.roomList.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.houseUseStatusList = [];
          this.roomTypeList = [];
          this.list = [];
          this.total = 0;
        }
      })
    },
    // 详情
    roomDetailInfoClick(id) {
      this.$refs.roomDetail.openModal(id);
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
  .u-grid-tooltip {
    position: absolute;
    z-index: 5;
    right: 9%;
    top: 15%;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-grid-select {
    position: absolute;
    z-index: 5;
    left: 10px;
    width: 60%;
  }
}
</style>
