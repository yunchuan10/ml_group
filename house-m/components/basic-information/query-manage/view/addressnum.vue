<template>
  <div>
    <div class="h-table">
      <div class="u-query-top f-clearfix f-relative">
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <th>单位名称</th>
              <td width='35%'>{{organName}}
              </td>
              <th>直属单位</th>
              <td>{{directlyOrganNum}}
              </td>
            </tr>
            <tr>
              <th>单位类别</th>
              <td>
                {{organTypeName}}
              </td>
              <th>单位级别</th>
              <td>{{organLevelName}}
              </td>
            </tr>
            <tr>
              <th>单位批复编制人数</th>
              <td>
                {{checkUserNum ? checkUserNum : 0}}人
              </td>
              <th>实有人数</th>
              <td>
                <a @click="personDetailInfoClick(organId)">{{realUserNum ? realUserNum : 0}}人</a>
              </td>
            </tr>
            <tr>
              <th>办公地址</th>
              <td>
                <span v-for='(item,index) in organAddressList' :key="index">{{item}}
                  <span v-show="index != (organAddressList.length -1)">,</span>
                </span>
              </td>
              <th>基本办公用房总使用面积</th>
              <td>{{baseRoomUseAreaSum ? baseRoomUseAreaSum + '㎡': ''}}
              </td>
            </tr>
            <tr>
              <th>附属用房建筑面积</th>
              <td>
                {{affiliatedRoomBuildAreaSum ? affiliatedRoomBuildAreaSum + '㎡': ''}}
              </td>
              <th>技术业务用房建筑面积</th>
              <td>{{techRoomBuildAreaSum ? techRoomBuildAreaSum + '㎡': ''}}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="u-query-top f-relative">
        <div class="m-search">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                  <li class="search-li-first">
                    <span>当前办公地址</span>
                    <el-select v-model="currentAddress" filterable placeholder="请选择当前办公地址" @change="getAddressId(currentAddress)">
                      <el-option v-for="(item, index) in currentAddressList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </li>
                  <li class="search-li">
                    <h2 class="u-query-h2">{{officeAddress != '' ?  officeAddress+'-' : ''}}{{organName}}办公用房使用情况</h2>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
        </div>
        <div class="f-absolute" style="padding-top:15px; z-index:2000">
          <!-- <el-radio-group v-model="activeName" @change="getSwitch" style="margin-left: 320px;" size="small">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group> -->
        </div>
        <div id="Usedpie" class="f-absolute" name='num' style="width: 450px; height: 400px;" v-show="roomList.length == 0 ? false : true">
        </div>
        <div class="u-query-right">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th>类型</th>
                <th>面积（㎡）</th>
              </tr>
              <!-- <tr>
                <td align="center">
                  <span class="f-color-red f-weight-bold">合计:</span>
                </td>
                <td align="center">
                  <span class="f-color-red f-weight-bold">{{roomListSum.totalArea}}</span>
                </td>              
              </tr> -->
              <tr v-for="(item, index) in roomList" :key="index">
                <td align="center">
                  <a @click="roomDetailInfoClick(organId,currentAddress,item.roomTypeName,item.roomTypeId)">{{item.roomTypeName}}</a>
                  <el-tooltip class="item u-grid-tips" v-show="item.roomTypeId == 'TYPENULL'" effect="dark" content="空置是指已分配到使用单位，但该单位未投入使用的房间" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                </td>
                <td align="center">
                  {{item.roomAreaSum}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 详情弹框 -->
    <v-room-detail ref="roomDetail"></v-room-detail>
    <v-person-detail ref="personDetail"></v-person-detail>
  </div>
</template>
<script>
import roomDetail from '@/components/basic-information/query-manage/view/addressnum-overview-detail'; // 详情弹出框
import personDetail from '@/components/basic-information/query-manage/view/addressnum-person-detail'; // 人员信息汇总表弹出框
export default {
  components: {
    'v-room-detail': roomDetail,
    'v-person-detail': personDetail
  },
  data() {
    let self = this;
    return {
      organName: '', //单位名称
      directlyOrganNum: '', //直属单位数量
      organLevelName: '', //单位行政区划级别
      baseRoomUseAreaSum: '', //基本办公用房面积
      affiliatedRoomBuildAreaSum: '', //附属用房面积
      techRoomBuildAreaSum: '', //技术业务用房面积
      checkUserNum: '', //单位批复编制人数
      realUserNum: '', //实际人数
      organTypeName: '', //单位类别
      organAddressList: '', //单位地址
      roomUseAreaSum: '', //办公用房总面积
      activeName: '数量', //
      currentAddress: '', //当前选中的单位
      officeAddress: '', //办公地址
      currentAddressList: [], //当前办公地址下拉选
      selectedOption: '', //院落默认选中一项
      courtyardList: [], //院落集合
      houseStatusList: [], //房间使用状态集合
      roomTypeList: [], // 房间类型集合
      roomTypeCountList: [], //获取图表集合
      myChart1: {}, //车辆状态图表
      list: [],
      roomList: [], //各房间信息
      roomListSum: {
        totalArea: 0 //面积总和
      },
      dataNumber: [],
      dataArea: [],
      chartOptions: {
        color: ['#4b7efe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {     // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'   // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 45//角度顺时针计算的
            }
          },
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.1],
            minInterval: 1, //柱形图Y轴为整数
            axisLabel: {
              formatter: '{value} 间'
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '40%',
            data: []
          }
        ]
      }
    };
  },
  computed: {
    organId() {
      return this.$store.state.mainData.organId;
    },
    token() {
      return this.$store.state.mainData.token;
    },
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    },
  },
  activated() {
    this.selectedOption = '';
    this.init();
    this.getRoomData();
    if (this.$route.query.organId) {
      this.$store.dispatch('organIdActions', this.$route.query.organId);
    }
    this.getTableData()
  },
  watch: {
    'organId': function (val) {
      this.currentAddressList = [];
      this.currentAddress = '';
      this.officeAddress = '';
      this.getTableData();
      this.downSelection()
    }
  },
  mounted() {
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
  },
  methods: {
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
    //当前办公地址下拉 
    downSelection() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_getCourtyard, params).then(res => {
        this.currentAddressList = res.data || [];
        if (this.currentAddressList.length > 0) {
          this.currentAddress = this.currentAddressList[0].value;
          this.officeAddress = this.currentAddressList[0].label;
        } else {
          this.currentAddress = '';
          this.roomList = [];
          this.officeAddress = '';
        }
        this.getRoomData();
      })
    },
    //办公室使用情况
    getRoomData() {
      let addressId = '';
      if (this.currentAddress == '') {
        addressId = '1';
      } else {
        addressId = this.currentAddress;
      }
      let params = {
        useOrganId: this.organId,
        courtyardId: addressId
      }
      this.$axiosGet(API.organSearch2_table1eChart, params).then(res => {
        this.roomList = res.data || [];
        if (this.roomList) {
          let roomSum = 0;
          let dataRoom = [];
          let totalArea = 0;
          this.dataNumber = [];
          this.dataArea = [];
          // this.activeName = '数量',
          this.roomList.forEach((item, index) => {
            dataRoom.push(item.roomTypeName);
            this.dataNumber.push(item.roomNum);
            this.dataArea.push(item.roomAreaSum);
            totalArea += item.roomAreaSum;
          })
          this.chartOptions.xAxis[0].data = dataRoom || [];
          this.chartOptions.series[0].data = this.dataArea;
          this.chartOptions.series[0].name = '面积';
          this.chartOptions.yAxis[0].axisLabel.formatter = '{value} ㎡';
          this.myChart1.setOption(this.chartOptions)
          // this.chartOptions.series[0].data = this.dataNumber || [];
          // this.chartOptions.series[0].name = '数量';
          // this.chartOptions.yAxis[0].axisLabel.formatter = '{value} 间';
          // this.myChart1.setOption(this.chartOptions);
          // this.roomListSum.totalArea = totalArea;

        }
      })
    },
    //当前办公地址改变echart 的值
    getAddressId(value) {
      let val = value
      if(val){     
        this.currentAddressList.forEach((item, index) => {
          if (item.value == val) {
            this.officeAddress = item.label
          }
        })
      }else{
        this.officeAddress = ''
      }
      this.getRoomData();
    },
    getSwitch() {
      if (this.activeName === '数量') {
        this.chartOptions.series[0].data = this.dataNumber;
        this.chartOptions.series[0].name = '数量';
        this.chartOptions.yAxis[0].axisLabel.formatter = '{value} 间';
        this.myChart1.setOption(this.chartOptions)
      } else {
        this.chartOptions.series[0].data = this.dataArea;
        this.chartOptions.series[0].name = '面积';
        this.chartOptions.yAxis[0].axisLabel.formatter = '{value} ㎡';
        this.myChart1.setOption(this.chartOptions)
      }
    },
    getSearch() {
      this.page = 1;
      this.getTableData();
    },
    //获取列表信息
    getTableData() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_table1Data, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data || {};
          this.organName = list.organName;

          this.directlyOrganNum = list.directlyOrganNum;
          this.baseRoomUseAreaSum = list.baseRoomUseAreaSum;

          this.parentOrganName = list.parentOrganName;
          this.directlyOrganNum = list.directlyOrganNum;
          this.baseRoomUseAreaSum = list.baseRoomUseAreaSum;
          this.organLevelName = list.organLevelName;
          this.organTypeName = list.organTypeName; //单位类别
          this.checkUserNum = list.checkUserNum;
          this.realUserNum = list.realUserNum;
          this.affiliatedRoomBuildAreaSum = list.affiliatedRoomBuildAreaSum;
          this.techRoomBuildAreaSum = list.techRoomBuildAreaSum;
          this.organAddressList = list.organAddressList;
          this.roomUseAreaSum = list.roomUseAreaSum;
        } else {
          list = [];
        }
      })
    },
    // 详情
    roomDetailInfoClick(id, courtyardId, type, roomTypeId) {
      this.$refs.roomDetail.openModal(id, courtyardId, type, roomTypeId);
    },
    // 人员信息汇总表
    personDetailInfoClick(id) {
      this.$refs.personDetail.openModal(id);
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
.u-query-top {
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #e4e7eb;
  -webkit-box-shadow: 2px 2px 5px #d7d7d7;
  box-shadow: 2px 2px 5px #d7d7d7;
  .u-query-right {
    margin-left: 500px;
  }
}
.h-table-info th {
  width: 200px !important;
}
.search-li-first {
  padding-left: 15px;
}
.search-li {
  padding-left: 400px;
}
.u-query-h2 {
  text-align: center;
  line-height: 40px;
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
}
.f-color-red {
  color: rgb(224, 15, 26);
}
.icon-gantanhao:before {
  color: #c0c4cc;
  padding-left: 8px;
}
.f-absolute {
  position: absolute !important;
}
</style>
