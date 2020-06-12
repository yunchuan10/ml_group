<template>
  <div>

    <div class="h-table">
      <!-- <div class=" f-pull-right search-group">
        <el-radio-group v-model="activeName" @change="getClick" size="small" style="margin-right:10px;">
          <el-radio-button label="数量">数量</el-radio-button>
          <el-radio-button label="面积">面积</el-radio-button>
        </el-radio-group>
      </div> -->
      <div class="f-clearfix"></div>
      <div id="Combarline" style="width: calc(100% - 20px); height: 300px;"> </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>合同编号</span>
                  <el-input clearable filterable placeholder="请输入" v-model="contractNo"></el-input>
                </li>
                <li>
                  <span>合同状态</span>
                  <el-select v-model="contractStatus" clearable filterable placeholder="请选择合同状态">
                    <el-option v-for="(iten, index) in contractStatusList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
                  </el-select>
                </li>               
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入" v-model="lesseeName"></el-input>
                </li>
                <li>
                  <span>合同开始日期</span>
                  <el-date-picker v-model="contractStartDate" :picker-options="pickerOptions0" type="date" placeholder="选择日期" @change="quCancel">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="contractEndDate" :picker-options="pickerOptions1" type="date" placeholder="选择日期" @change="quCancel">
                  </el-date-picker>
                </li>
                <li style="padding-top:10px; margin-left:-20px">
                  <el-radio-group v-model="checkList" @change="select(checkList)">
                    <el-radio :label="1">近一个月</el-radio>
                    <el-radio :label="2">近三个月</el-radio>
                    <el-radio :label="3">近半年</el-radio>
                    <el-radio :label="4">近一年</el-radio>
                    <el-radio :label="5">全部</el-radio>
                  </el-radio-group>
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
      <el-table :data="list" stripe style="width: auto" @sort-change="sortChange">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号">
          <template slot-scope="scope">
            <a @click="roomDetailInfoClick(scope.row.id)">{{scope.row.contractNo}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="合同开始日期" sortable>
          <template slot-scope="scope">
            {{scope.row.startDate ? formartDate(scope.row.startDate):'-'}}

          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="合同结束日期" sortable>
          <template slot-scope="scope">
            {{scope.row.endDate ? formartDate(scope.row.endDate):'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="rentOrgan" label="出租方">
        </el-table-column>
        <el-table-column prop="lesseeName" label="承租人">
        </el-table-column>
        <el-table-column prop="rental" label="租金（元/年）">
        </el-table-column>
        <el-table-column prop="statusName" label="合同状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.statusName)"> {{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remainingDays" label="合同到期提醒">
          <template slot-scope="scope">
            {{scope.row.remainingDays ? scope.row.statusName == '已解除' ? '--':'剩余：'+scope.row.remainingDays + '天' : '--'}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom">
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
import roomDetail from '@/components/operate/room-manage/room-companynum'; // 详情弹出框 - 合同
import { constants } from 'fs';
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    let self = this;
    return {
      pickerOptions0: {
        disabledDate(time) {
          if (self.contractEndDate) {
            return time.getTime() > self.contractEndDate;
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.contractStartDate) {
            return time.getTime() < self.contractStartDate;
          }
        }
      },
      activeName: '数量',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      orderBy: '',//排序方式 ASC/DESC
      // courtyardId: '', //院落id
      useOrganName: '',//使用单位名称
      useRoomNum: '',//使用单位数量
      useAreaSum: '',//使用单位面积
      list: [
        {
          useOrganName: '1'
        }
      ], //表格列表信息
      mybarlineChart: {},// 使用单位图表      
      option: {
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
          color: ['#66c33a', '#6bb0f7', '#a7b5e0', '#90b0a5', '#c3b98f', '#b19d9d', '#f66e6e', '#e7a33c'],
          label: {
            normal: {}
          }
        }],
      },
      checkList: 5,
      floorName: '', //查询项定义
      defaultTime: '', //查询项
      contractNo: '', //合同编号
      contractStatus: '', //合同状态
      contractStatusList: [], //合同状态集合
      lesseeName: '', //承租人名称
      contractStartDate: '', //合同开始日期
      contractEndDate: '', //合同结束日期
      houseStatusNamelist: [], //图表块名
      radio: '',
    }
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
      this.getCombarlinedata();
      this.getDataRequest();
    }
  },
  activated() {
    this.contractStatus = '';
    this.mybarlineChart = echarts.init(document.getElementById('Combarline'));
    this.mybarlineChart.setOption(this.option);
    this.getDataRequest();
    this.getCombarlinedata();
    this.init();
    this.getHousingStatus();
  },
  mounted() {
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
    formartDate(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return '';
      }
    },
    //获取图表的值
    getCombarlinedata() {
      let params = {
        street: this.operateStreet
      }
      this.$axiosGet(API.comprehensive_getStreetContractEchart, params).then(res => {
        if (res.data) {
          this.houseStatusNamelist = res.data
          let roomUseList = [];
          let legend = [];
          if (this.houseStatusNamelist.length > 0) {
            if (this.activeName === '数量') {
              this.houseStatusNamelist.forEach((item, index) => {
                if (item.contractStatus === 'END') {
                  roomUseList.push({
                    value: item.totalNum || '0',
                    name: `已结束`
                  })
                } else if (item.contractStatus === 'IN_PROGRESS') {
                  roomUseList.push({
                    value: item.totalNum || '0',
                    name: `进行中`
                  })
                } else if (item.contractStatus === 'RELEASED') {
                  roomUseList.push({
                    value: item.totalNum || '0',
                    name: `已解除`
                  })
                }
                legend.push(item.contractStatusName)
              })
              // legend = ['已结束', '进行中', '已解除'];
            }
          }
          this.option.series[0].data = roomUseList || [];
          this.option.legend.data = legend;
          this.$set(this.option.legend, 'formatter', this.getLengendForMatter);
          this.mybarlineChart.setOption(this.option);
        } else {
          this.option.series[0].data = [];
        }
      })
    },
    //后缀
    getLengendForMatter(name) {
      let value = '';
      this.option.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        if (this.activeName === '数量') {
          return `${name}：${value}份`;
        } else {
          return `${name}：${value}㎡`;
        }
      }
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
        areaId: this.areaId,
        street: this.operateStreet,
        contractNo: this.contractNo,
        status: this.contractStatus || '',
        lesseeName: this.lesseeName,
        startDate: FORMATGET.formatGET(this.contractStartDate) || '',
        endDate: FORMATGET.formatGET(this.contractEndDate) || '',
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosGet(API.comprehensive_getStreetContractPage, params).then(res => {
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
    // 详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    select(selection) {
      if (selection == '1') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '2') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '3') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '4') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '5') {
        this.contractStartDate = '';
        this.contractEndDate = '';
      }
    },
    quCancel() {
      this.checkList = 5
    },
    getHousingStatus() {
      this.$axiosGet(API.contract_queryContractStatus, {}).then(res => {
        this.contractStatusList = res.data.contractStatusList || []; //合同状态集合
      })
    },
    checkStatus(value) {
      if (value == '进行中') {
        return 's-state-caveat'
      } else if (value == '已解除') {
        return 's-state-prohibited'
      } else if (value == '已结束') {
        return 's-state-fail'
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.h-table {
  float: left;
  margin: -20px 0 20px 0 !important;
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
.el-date-editor.el-input {
  width: auto !important;
}
.m-search {
  margin-bottom: 10px;
}
</style>
