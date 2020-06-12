<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1200px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>{{useStatusName}}办公用房列表</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <div id="allocateBar" v-if="this.useStatusName ==='已分配'" name='num' style="width: calc(100% - 20px); height: 400px;">
          </div>
          <div class="m-search">
            <table>
              <tr>
                <td>
                  <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                    <li>
                      <span>房间号</span>
                      <el-input clearable placeholder="请输入房间号" v-model="search.roomNo"></el-input>
                    </li>
                    <li>
                      <span>房间位置</span>
                      <el-cascader style="padding-top:0;" placeholder="请选择房间位置" v-model="search.roomPos" clearable :options="roomList" filterable change-on-select></el-cascader>
                    </li>
                    <li v-if="this.useStatusName ==='已分配'">
                      <span>使用单位</span>
                      <el-input clearable placeholder="请输入使用单位" v-model="search.useOrganName"></el-input>
                    </li>
                    <li v-if="this.useStatusName ==='已分配'">
                      <span>房间类型</span>
                      <el-cascader style="padding-top:0;" :options="roomTypeList" v-model="search.houseType" filterable clearable placeholder="请选择房间类型">
                      </el-cascader>
                    </li>
                    <li v-if="this.useStatusName ==='已分配'">
                      <span>使用状态</span>
                      <el-select v-model="search.roomStatus" filterable clearable placeholder="请选择使用状态">
                        <el-option v-for="item in houseUseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
                      </el-select>
                    </li>                 
                  </ul>
                </td>
                <td class="u-search-but">
                  <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <div class="h-table">
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column label="房间号" prop="roomNo">
              <template slot-scope="scope">
                <a @click="roomDetailInfoClick(scope.row.id,useStatusName)">{{scope.row.roomNo}}</a>
              </template>
            </el-table-column>
            <el-table-column label="房间位置" prop="roomAddress">
            </el-table-column>
            <el-table-column label="建筑面积（㎡）" prop="buildArea">
            </el-table-column>
            <el-table-column label="使用面积（㎡）" prop="useArea">
            </el-table-column>
            <el-table-column label="申请单号" prop="orderNo" v-if="this.useStatusName ==='处置中'" :key="Math.random()">
              <template slot-scope="scope">
                <a @click="disposalDetailClick(scope.row.orderId)">{{scope.row.orderNo}}</a>
              </template>
            </el-table-column>
            <el-table-column label="申请单号" prop="orderNo" :key="Math.random()" v-if=" this.useStatusName ==='已拆除' || this.useStatusName ==='已转换用途' ||  this.useStatusName ==='已出租' || this.useStatusName ==='已拍卖'">
              <template slot-scope="scope">
                <a @click="disposalHandleDetailClick(scope.row.orderId)">{{scope.row.orderNo}}</a>
              </template>
            </el-table-column>
            <el-table-column label="申请单号" prop="orderNo" v-if="this.useStatusName ==='调配中'" :key="Math.random()">
              <template slot-scope="scope">
                <a @click="approvalDetailClick(scope.row.orderId,'')">{{scope.row.orderNo}}</a>
              </template>
            </el-table-column>
            <el-table-column label="处置方式" prop="handleTypeName" v-if="this.useStatusName ==='处置中'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="申请时间" prop="createdAt" :formatter="dateFormat" v-if="this.useStatusName ==='处置中' || this.useStatusName ==='调配中'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="订单状态" prop="orderStatusName" v-if="this.useStatusName ==='处置中' || this.useStatusName ==='调配中'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="申请单位" prop="organName" v-if="this.useStatusName ==='调配中'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="管理单位" prop="manageOrganName" v-if="this.useStatusName ==='已转换用途'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="转换用途" prop="purpose" v-if="this.useStatusName ==='已转换用途'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="转换用途时间" prop="conversionDate" :formatter="dateFormat" v-if="this.useStatusName ==='已转换用途'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="租赁期限（年）" prop="leaseTerm" v-if="this.useStatusName ==='已出租'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="受让人" prop="receivePerson" v-if="this.useStatusName ==='已拍卖'" :key="Math.random()">
            </el-table-column>

            <el-table-column label="成交金额（万元）" prop="clinchDealMoney" v-if="this.useStatusName ==='已拍卖'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="拍卖时间" prop="auctionDate" :formatter="dateFormat" v-if="this.useStatusName ==='已拍卖'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="承租人" prop="lesseeName" v-if="this.useStatusName ==='已出租'" key="lesseeName">
            </el-table-column>
            <el-table-column label="租金（元/年）" prop="clinchDealPrice" v-if="this.useStatusName ==='已出租'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="出租开始时间" prop="rentStartDate" :formatter="dateFormat" v-if="this.useStatusName ==='已出租'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="拆除单位" prop="demolitionOrganName" v-if="this.useStatusName ==='已拆除'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="拆除时间" prop="removedDate" :formatter="dateFormat" v-if="this.useStatusName ==='已拆除'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="房间状态" prop="useStatusName" v-if="this.useStatusName ==='闲置'" :key="Math.random()">
            </el-table-column>

            <el-table-column label="使用单位" prop="useOrganName" v-if="this.useStatusName ==='已分配'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="房间类型" prop="roomTypeNameString" v-if="this.useStatusName ==='已分配'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="使用状态" prop="useClientStatusName" v-if="this.useStatusName ==='已分配'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="使用人数" prop="userNum" v-if="this.useStatusName ==='已分配'" :key="Math.random()">
            </el-table-column>
            <el-table-column label="超标情况" v-if="this.useStatusName ==='已分配'" :key="Math.random()">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
              </template>
            </el-table-column>
           </el-table>
          </div>
        </div>
        <div class="h-table-bottom f-clearfix">         
          <div class="h-table-pages f-pull-right">
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <v-room-detail ref="roomDetail"></v-room-detail>
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <disposalHandle-detail ref="disposalHandleDetail"></disposalHandle-detail>
    <approval-detail ref="approvalDetail"></approval-detail>
  </div>
</template>

<script>
import roomDetail from './addressnum-sub-detail'; // 详情弹出框
import disposalDetail from '@/components/disposal-manage/disposal-applydetail'; // 详情弹出框
import disposalHandleDetail from '@/components/disposal-manage/disposal-detail'; // 处置执行单详情弹出框
import approvalDetail from '@/components/configure-manage-v2/room-approval/approval-detail'; // 用房申请详情弹出框（调配中）
export default {
  components: {
    'v-room-detail': roomDetail,
    'disposalHandle-detail': disposalHandleDetail, //处置执行单详情
    'approval-detail': approvalDetail, //用房申请详情
    'disposal-detail': disposalDetail //处置申请详情
  },
  data() {
    return {
      roomData: {}, // 房间详情数据
      roomUser: [],
      myChart3: {},
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [],
      search: {
        excessiveStatus: '', //超标情况
        roomStatus: '', //使用状态
        roomPos: [], // 房间位置
        roomNo: '', // 房屋号
        houseType: [], //房间类型
        useOrganName: '' //使用单位
      },
      roomTypeList: [], //房间类型集合
      houseUseStatusList: [], //房间使用状态集合
      roomList: [], // 房间级联下拉选
      useStatusName: '', //房间状态名称
      useStatus: '', //房间状态
      roomTypeNameList: [], //类型名称集合
      roomNumList: [], //数量集合
      useAreaSumList: [],//面积集合
      floorName: '',
      chatOptions1: {
        title: [{
          text: '',
          textStyle: { fontSize: 16 },
          top: 0,
          left: 10
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['面积'],
          show:false
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: { //设置x轴的字
              show:true,
              interval:0//使x轴横坐标全部显示             
            }
          }
        ],
        color: ['#66c33a', '#6bb0f7', '#a7b5e0'],
        yAxis: [
          {
            type: 'value',
            name: '面积',
            min: 0,
            // max: 250,
            // interval: 50,
            boundaryGap: [0, 0.1],
            axisLabel: {
              formatter: '{value} ㎡'
            },
            splitLine: false
          }
        ],
        series: [
          {
            name: '面积',
            type: 'bar',
            barWidth: '40%',
            data: []
          }         
        ]
      },
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() {

  },
  deactivated() {

  },
  methods: {
    // 初始化弹出框
    openModal(id, name, useStatus) {
      this.carDetailShow = true;
      this.courtyardId = id;
      this.useStatusName = name;
      this.useStatus = useStatus;
      this.search.roomStatus = '';
      this.search.roomNo = '';
      this.search.excessiveStatus = '';
      this.search.roomPos = [];
      this.search.houseType = [];
      this.search.useOrganName = '';
      this.page = 1;
      this.getChartData();
      this.getDetail();
      this.getSearchDate(); // 处置中状态的房间位置下拉框
      if (this.useStatusName === '已分配') {
        this.$nextTick(() => {
          this.myChart3 = echarts.init(document.getElementById('allocateBar'));
          this.myChart3.setOption(this.chatOptions1);
        }
        )
      }
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart3.resize();
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
    //房间列表
    getDetail() {
      let roomTypeId = '';
      if( Array.isArray(this.search.houseType) && this.search.houseType[0] ){
        roomTypeId = this.search.houseType[0];
      }
      let params = {
        courtyardId: this.courtyardId,
        useStatus: this.useStatus, // 房间状态
        roomNo: this.search.roomNo || '',
        floorId: this.search.roomPos[1] || '',
        storeysId: this.search.roomPos[2] || '', //根据房间位置查询
        useOrganName: this.search.useOrganName || '', //使用单位
        useClientStatus: this.search.roomStatus || '', //使用状态
        roomTypeId: this.search.houseType[0] || '', //房间类型
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.yardSearch2_listRoom, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list && list != null || list != undefined) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    //下拉选
    getSearchDate() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.yardSearch2_getTable1Select, params).then(res => {
        this.roomList = res.data.floorAndStoreys;  //房屋位置
        this.houseUseStatusList = res.data.useStatusList; //房间使用状态
        this.roomTypeList = res.data.roomTypes;
      })
    },
    getChartData() {
      let params = {
        courtyardId: this.courtyardId,
      }
      this.$axiosGet(API.yardSearch2_countHasAssign, params).then(res => {
        let list = [];
        let roomTypeNameList = [];
        let roomNumList = [];
        let useAreaSumList = [];
        if (res.data) {
          list = res.data;
        }
        if (list) {
          list.forEach((item, index) => {
            roomTypeNameList.push(item.roomTypeName)
            useAreaSumList.push(item.roomBuildAreaSum)
          })
        } else {
          this.roomNumList = '0';
          this.useAreaSumList = '0';
        }
        this.chatOptions1.series[0].data = useAreaSumList || '';
        this.chatOptions1.xAxis[0].data = roomTypeNameList || '';
        if (this.useStatusName === '已分配') {
          this.myChart3.setOption(this.chatOptions1);        }
      })
    },
    //查询
    searchClick() {
      this.page = 1;
      this.getDetail();
    },
    // 详情
    roomDetailInfoClick(id, name) {
      this.$refs.roomDetail.openModal(id, name);
    },
    // 处置申请单详情
    disposalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
    },

    // 处置执行单详情
    disposalHandleDetailClick(id) {
      this.$refs.disposalHandleDetail.openModal(id);
    },
    // 用房申请详情
    approvalDetailClick(id) {
      this.$refs.approvalDetail.openModal(id);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDetail();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDetail();
    },
    checkStatus(value) {
      if (value == 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
      }
    },
    checkStatusName(value) {
      if (value == 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },

  }
};
</script>

<style lang="scss" scoped>
.m-search {
  margin-bottom: 10px;
  span {
    float: left;
    padding: 10px 5px 0 0;
  }
  .el-input {
    float: left;
    width: auto;
  }
  li {
    float: left;
    margin: 5px 30px 5px 0;
    .el-cascader {
      line-height: 39px !important;
    }
  }
}
.h-tab-content {
  margin-top: 0 !important;
}
</style>

