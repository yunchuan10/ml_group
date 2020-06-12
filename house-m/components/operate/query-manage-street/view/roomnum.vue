<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div class="u-grid-charttab">
          <el-radio-group v-model="activeName" @change="getSwitch" size="small" style="margin-right:-20px;">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group>
        </div>
        <div id="Usedpie" name='num' style="width: calc(100% - 20px); height: 300px;">
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>门牌号</span>
                  <el-input clearable filterable placeholder="请输入门牌号" v-model="houseNo"></el-input>
                </li>
                <li>
                  <span>取得方式</span>
                  <el-select v-model="acquisitionMode" filterable clearable placeholder="请选择取得方式">
                    <el-option v-for="(iten, index) in acquisitionModeList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>房屋状态</span>
                  <el-select v-model="houseStatus" filterable clearable placeholder="请选择房屋状态">
                    <el-option v-for="(iten, index) in houseStatusList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
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
        <el-table-column prop="street" label="街道">
        </el-table-column>
        <el-table-column prop="houseNo" label="门牌号">
          <template slot-scope="scope">
            <a @click="roomDetailInfoClick(scope.row.id)">{{scope.row.houseNo}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="houseAddress" label="地址坐落">
        </el-table-column>
        <el-table-column prop="area" label="经营面积（㎡）">
        </el-table-column>
        <el-table-column prop="acquisitionModeName" label="取得方式">
        </el-table-column>
        <el-table-column prop="statusName" label="房屋状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.statusName)"> {{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="picture" label="房间照片">
          <template slot-scope="scope">
            <i :class="scope.row.picture == 'YES' ? 'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <!-- <div class="h-table-btns f-pull-left">
        <button class="el-button-export">
          <i class="iconfont icon-daochu"></i>导出</button>
      </div> -->
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>

<script>
import roomDetail from '@/components/operate/room-manage-street/room-roomnum'; // 详情弹出框
import { setTimeout } from 'timers';
export default {
  components: {
    'v-room-detail': roomDetail
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
      houseNo: '', // 门牌号
      houseStatus: '', //房屋状态
      houseStatusList: [], //房屋状态集合
      acquisitionMode: '', // 取得方式
      acquisitionModeList: [], // 取得方式集合
      houseStatusNamelist: [], //图表块名
      chatOptions: {
        // title: [{
        //   text: '办公用房总体使用情况',
        //   textStyle: { fontSize: 16 },
        //   top: 10,
        //   left: 10
        // }],
        tooltip: {
          trigger: 'item',
          formatter: "{b}，{d}%"
        },
        legend: {
          orient: 'vertical',
          icon: 'rect',
          right: '10%',
          y: 'center',
          data: [],
        },
        series: [{
          // name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          // radius: '70%',
          center: ['48%', '55%'],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          color: ['#6bb0f7', '#66c33a'],
          label: {
            normal: {}
          }
        }]
      },
      // roomNum: '0',
    };
  },

  activated() {
    this.houseNo = '';
    this.houseStatus = '';
    this.acquisitionMode = '';
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
    this.myChart1.setOption(this.chatOptions);
    this.getTableData();
    this.getRoomCount();
    this.init();
    this.getHousingStatus();
  },
  mounted() {
  },
  computed: {
    operateStreet() {
      return this.$store.state.mainData.operateStreet;
    },
    areaId() {
      return this.$store.state.mainData.areaId
    },
  },
  watch: {
    'operateStreet': function (val) {
      this.getTableData();
      this.getRoomCount();;
    }
  },
  deactivated() {
    // this.$destroy();
  },
  methods: {
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
        street: this.operateStreet
      }
      this.$axiosGet(API.comprehensive_getStreetHouseEchart, params).then(res => {
        if (res.data) {
          this.houseStatusNamelist = res.data
          let roomUseList = [];
          let legend = [];
          if (this.houseStatusNamelist.length > 0) {
            if (this.activeName === '数量') {
              this.houseStatusNamelist.forEach((item, index) => {
                if (item.houseStatus === 'DEALIDLE') {
                  roomUseList.push({
                    value: item.totalNum || '0',
                    name: `闲置`
                  })
                } else if (item.houseStatus === 'RENTING') {
                  roomUseList.push({
                    value: item.totalNum || '0',
                    name: `出租中`
                  })

                }
                legend.push(item.houseStatusName)
              })
              // legend = ['闲置', '出租中'];
            } else {
              this.houseStatusNamelist.forEach((item, index) => {
                if (item.houseStatus === 'DEALIDLE') {
                  roomUseList.push({
                    value: item.totalBuildArea || '0',
                    name: `闲置`
                  })
                } else if (item.houseStatus === 'RENTING') {
                  roomUseList.push({
                    value: item.totalBuildArea || '0',
                    name: `出租中`
                  })
                }
                legend.push(item.houseStatusName)

              })
              // legend = ['闲置', '出租中'];
            }
          }
          this.chatOptions.series[0].data = roomUseList || [];
          this.chatOptions.legend.data = legend;
          this.$set(this.chatOptions.legend, 'formatter', this.getLengendForMatter);
          // this.$set(this.chatOptions.series[0].label.normal, 'formatter', this.setForMatter);
          this.myChart1.setOption(this.chatOptions); //this.options为车辆状态的配置
        } else {
          this.chatOptions.series[0].data = [];
        }

      })
    },
    //后缀
    getLengendForMatter(name) {
      let value = '';
      this.chatOptions.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        if (this.activeName === '数量') {
          return `${name}：${value}处`;
        } else {
          return `${name}：${value}㎡`;
        }
      }
    },
    getSearch() {
      this.page = 1;
      this.getTableData();
    },
    //房屋信息列表
    getTableData() {
      let params = {
        street: this.operateStreet,
        houseNo: this.houseNo, //门牌号
        status: this.houseStatus || '',
        acquisitionMode: this.acquisitionMode || '',
        pageNum: this.page,
        pageSize: this.pageSize,
      }
      this.$axiosGet(API.comprehensive_getStreetHousePage, params).then(res => {
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
      });
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
    },
    //下拉框
    getHousingStatus() {
      this.$axiosGet(API.dealhouse_queryStatusAndAcquisitionList, {}).then(res => {
        this.houseStatusList = res.data.houseStatusList || []; //房屋出租状态集合
        this.acquisitionModeList = res.data.acquisitionModeList; //取得方式集合
      })
    },
    checkStatus(value) {
      if (value == '闲置') {
        return 's-state-success'
      } else {
        return 's-state-prohibited'
      }
    },
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
  margin: -20px 0 20px 0 !important;
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
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 310px;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 12%;
    top: 15%;
  }
}
.m-search {
  margin-bottom: 10px;
}
</style>
