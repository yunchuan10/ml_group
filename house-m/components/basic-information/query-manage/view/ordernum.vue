<template>
  <div>
    <div class="h-table">
      <div class="u-grid-chart f-relative">
        <div class="f-clearfix"></div>
        <div id="Usedpie" name='num' style="width: calc(100% - 20px); height: 400px;">
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>申请单号</span>
                  <el-input clearable placeholder="请输入申请单号" v-model="orderNo"></el-input>
                </li>
                <li>
                  <span>订单类型</span>
                  <el-select v-model="orderType" filterable clearable placeholder="请选择订单类型">
                    <el-option label="用房申请" value="one"></el-option>
                    <el-option label="年度计划申请" value="two"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>订单状态</span>
                  <el-select v-model="orderStatus" filterable clearable placeholder="请选择订单状态">
                    <el-option v-for="item in orderStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
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
      <el-table :data="list" stripe style="width: auto; margin-top: 10px">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="申请单号">
          <template slot-scope="scope">
            <a v-show="scope.row.applyType ==='用房申请'" @click="approvalDetailInfoClick(scope.row.applyId,scope.row.status)">{{scope.row.orderNo}}</a>
            <a v-show="scope.row.applyType ==='年度计划申请'" @click="annualDetailClick(scope.row.applyId)">{{scope.row.orderNo}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="申请人">
        </el-table-column>
        <el-table-column prop="applyType" label="订单类型">
        </el-table-column>
        <el-table-column prop="createdAt" :formatter='dateFormat' label="申请时间">
        </el-table-column>
        <el-table-column prop="orderStatusName" label="订单状态">
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <approval-detail ref="approvalDetail"></approval-detail>
    <!-- 详情弹出框 -->
    <annualplan-detail ref="annualDetail"></annualplan-detail>
  </div>
</template>

<script>
import annualDetail from '@/components/basic-information/query-manage/view/annualplan-detail'; // 详情弹出框
import approvalDetail from '@/components/basic-information/query-manage/view/approval-detail'; // 详情弹出框
export default {
  components: {
    'annualplan-detail': annualDetail,
    'approval-detail': approvalDetail
  },
  data() {
    let self = this;
    return {
      activeName: '数量',
      orderNo: '', //申请单号
      orderType: '', //订单类型
      orderStatus: '', //订单状态
      orderStatusList: '', //订单状态集合
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      selectedOption: '', //院落默认选中一项
      myChart1: {}, //车辆状态图表
      list: [],
      chatOptions: {
        color: ['#4b7efe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          name: '个数',
          min: 0,
          minInterval: 1,
          boundaryGap: [0, 0.1]
        },
        series: [{
          data: [],
          name: '累积订单数量',
          barWidth: '60',
          type: 'bar'
        }]
      }
    };
  },
  computed: {
    organId() {
      return this.$store.state.mainData.organId;
    },
    token() {
      return this.$store.state.mainData.token;
    }
  },
  watch: {
    'organId': function (val) {
      this.myChart1 = echarts.init(document.getElementById('Usedpie'));
      this.myChart1.setOption(this.chatOptions);
      this.getRoomCount();
    }
  },
  activated() {
    this.getSelect()
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
    this.myChart1.setOption(this.chatOptions);
    this.selectedOption = '';
    this.getTableData();
    this.getRoomCount();
    this.init();
  },
  mounted() {
  },
  deactivated() {
  },
  methods: {
    // 图表大小自适应
    init() {
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    // 获取图表数据
    getRoomCount() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_countOrder, params).then(res => {
        let orderList = [];
        let orderNum = [];
        if (res.data && res.data != null) {
          res.data.forEach((item, index) => {
            orderList.push(item.name)
            orderNum.push(item.value)
          })
        }
        if (res.data && res.data != null) {
          this.chatOptions.xAxis.data = orderList;
          this.chatOptions.series[0].data = orderNum;
          this.myChart1.setOption(this.chatOptions); //this.chatOptions为房间类型分类
        } else {
          orderNum = [];
          this.myChart1.clear();
        }
      }
      )
      this.getTableData();
    },
    getSearch() {
      this.page = 1;
      this.getTableData();
    },
    //获取列表信息
    getTableData() {
      let params = {
        useOrganId: this.organId,
        orderType: this.orderType || '', //订单类型
        orderNo: this.orderNo, //申请单号
        queryApplyStatus: this.orderStatus || '', //订单状态
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.organSearch2_listOrder, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data;
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
    //获取订单类型的下拉框
    getSelect() {
      this.$axiosGet(API.organSearch2_getOrderStatus, {}).then(res => {
        this.orderStatusList = res.data;
      })
    },
    // 详情
    approvalDetailInfoClick(roomId, status) {
      this.$refs.approvalDetail.openModal(roomId, status);
    },
    // 年度计划申请详情
    annualDetailClick(id) {
      this.$refs.annualDetail.openModal(id);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getTableData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.h-table {
  float: left;
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
}
</style>
