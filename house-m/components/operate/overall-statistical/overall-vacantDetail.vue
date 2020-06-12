<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <!-- <router-link :to="{path:'/operate/overall-statistical/overall-company-list',query:{areaId:areaId,currentPage:Hpage}}">
            <button class="f-pull-right u-bread-btn">
              返回
            </button> -->
          <!-- </router-link> -->
          <button class="f-pull-right u-bread-btn" @click="backHandle">
            返回
          </button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>合同编号</span>
                  <el-input clearable filterable placeholder="请输入合同编号" v-model="contractNo"></el-input>
                </li>
                <li>
                  <span>合同状态</span>
                  <el-select v-model="contractStatus" clearable filterable placeholder="请选择合同状态">
                    <!-- <el-option label="全部" value=''></el-option> -->
                    <el-option v-for="(iten, index) in contractStatusList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入承租人" v-model="lesseeName"></el-input>
                </li>
                <li>
                  <span>合同开始日期</span>
                  <el-date-picker v-model="contractStartDateString" type="date" placeholder="请选择日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="contractEndDateString" type="date" placeholder="请选择日期">
                  </el-date-picker>
                </li>
                <li style="padding-top:10px">
                  <el-radio-group v-model="checkList" @change="select(checkList)">
                    <el-radio :label="1">近一个月</el-radio>
                    <el-radio :label="2">近三个月</el-radio>
                    <el-radio :label="3">近半年</el-radio>
                    <el-radio :label="4">近一年</el-radio>
                    <el-radio :label="5">全部</el-radio>
                  </el-radio-group>
                  <!-- <el-checkbox-group v-model="checkList">
                    <el-checkbox label="近一个月"></el-checkbox>
                    <el-checkbox label="近三个月"></el-checkbox>
                    <el-checkbox label="近半年"></el-checkbox>
                    <el-checkbox label="近一年"></el-checkbox>
                  </el-checkbox-group> -->
                </li>
              </ul>
            </td>

            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">{{pushdate}} {{organName}}—出租中经营性房产明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="street" label="街道" width="170">
          </el-table-column>
          <el-table-column prop="houseNo" label="门牌号" sortable width="140">
          </el-table-column>
          <el-table-column prop="houseAddress" label="地址坐落" width="140">
          </el-table-column>
          <!-- <el-table-column prop="houseStatus" label="合同编号" width="140">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.useClientStatus)">{{scope.row.useClientStatus || '-'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="contractNo" label="合同编号" width="140">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.contractId)">{{scope.row.contractNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="contractStartDate" label="合同开始日期">
            <template slot-scope="scope">
              {{scope.row.contractStartDate ?scope.row.contractStartDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column prop="contractEndDate" label="合同结束日期">
            <template slot-scope="scope">
              {{scope.row.contractEndDate ?scope.row.contractEndDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column prop="rentOrgan" label="出租方" width="140">
          </el-table-column>
          <el-table-column prop="lesseeName" label="承租人" width="140">
          </el-table-column>
          <el-table-column prop="contractRental" label="租金（元/年）" sortable width="140">
          </el-table-column>
          <el-table-column prop="contractStatusName" label="合同状态" width="140">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.contractStatusName)"> {{scope.row.contractStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contractStatus" label="合同到期提醒" width="140">
            <template slot-scope="scope">
              {{scope.row.remainingDays ? scope.row.contractStatusName == '已解除' ? '--':'剩余：'+scope.row.remainingDays + '天' : '--'}}
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情 -->
    <v-room-detail ref="roomDetail"></v-room-detail>

  </div>
</template>

<script>
import roomDetail from '@/components/operate/room-manage-street/room-companynum'; // 详情弹出框

export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      useClientStatus: '',//房间出租中状态
      pushdate: '', //查询时间
      organName: '',
      organId: '', //单位id
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomTypeId: '',
      list: [], // 列表数据集合
      roomAddress: '', //地址
      contractNo: '', //合同编号
      rentPerson: '', //出租方
      lesseeName: '', //承租人
      contractStartDateString: '', //合同开始时间
      contractEndDateString: '', //合同结束时间
      checkList: 5, //单选按钮值
      contractStatus: '', //合同状态
      contractStatusList: [], //合同状态集合

    };
  },
  activated() {
    if (Object.keys(this.$route.query).length != 0) {
      // this.roomTypeId = this.$route.query.roomTypeId;
      this.areaId = this.$route.query.areaId;
      this.useClientStatus = this.$route.query.useClientStatus;
      this.pushdate = this.$route.query.queryTime;
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
    }
    this.contractStatus = '';
    this.contractNo = ''; //合同编号
    this.lesseeName = ''; //承租人
    this.contractStartDateString = ''; //合同开始时间
    this.contractEndDateString = ''; //合同结束时间
    this.checkList = 5; //单选按钮值
    this.page = 1;
    this.getRoomDataRequest()
    this.getHousingStatus();
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    //后退
    backHandle() {
      this.$router.back()
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
    // 查询按钮
    searchClick() {
      this.page = 1;
      // this.getDataRequest();
      this.getRoomDataRequest();
    },
    // 获取列表数据
    // getDataRequest() {
    //   let params = {
    //     organId: this.organId,
    //     useClientStatus: this.useClientStatus || '',
    //     roomTypeId: this.roomTypeId, //房间类型
    //     queryTime: this.pushdate,
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsRoomList, params).then(res => {
    //     let list = [];
    //     if (res.data) {
    //       list = res.data.list;
    //       this.total = res.data.total;
    //     }
    //     if (list) {
    //       list.forEach((item, index) => {
    //         list[index].num = index + 1;
    //       });
    //     }
    //     this.list = list;
    //   });
    // },
    getRoomDataRequest() {
      let params = {
        organId: this.organId || '',
        contractStatus: this.contractStatus || '',
        contractNo: this.contractNo || '', //合同编号
        lesseeName: this.lesseeName || '', //承租人
        contractStartDate: FORMATGET.formatGET(this.contractStartDateString) || null, //合同开始时间
        contractEndDate: FORMATGET.formatGET(this.contractEndDateString) || null, //合同结束时间
        houseStatus: this.useClientStatus, //房屋默认为出租状态
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosGet(API.dealstatistical_rentStatisticsRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      if (this.$route.query.roomTypeId) {
        this.getDataRequest();
      } else if (this.$route.query.useClientStatus) {
        this.getRoomDataRequest()
      }
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      if (this.$route.query.roomTypeId) {
        this.getDataRequest();
      } else if (this.$route.query.useClientStatus) {
        this.getRoomDataRequest()
      }
    },
    select(selection) {
      if (selection == '1') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.contractStartDateString = start;
        this.contractEndDateString = end;
      } else if (selection == '2') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
        this.contractStartDateString = start;
        this.contractEndDateString = end;
      } else if (selection == '3') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
        this.contractStartDateString = start;
        this.contractEndDateString = end;
      } else if (selection == '4') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        this.contractStartDateString = start;
        this.contractEndDateString = end;
      } else if (selection == '5') {
        this.contractStartDateString = '';
        this.contractEndDateString = '';
      }
    },
    exportClick() { // 导出
      let params = {
        areaId: this.areaId || '',
        organId: this.organId || '',
        contractStatus: this.contractStatus || '',
        contractNo: this.contractNo || '', //合同编号
        lesseeName: this.lesseeName || '', //承租人
        contractStartDateString: FORMATGET.formatGET(this.contractStartDateString) || '', //合同开始时间
        contractEndDateString: FORMATGET.formatGET(this.contractEndDateString) || '', //合同结束时间
        houseStatus: this.useClientStatus, //房屋默认为出租状态
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize,
        exportFlag: 'YES',
        organName: this.organName
      };
      this.$axiosPost(API.dealstatistical_doExporRentRoomList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })
    },
    getHousingStatus() {
      this.$axiosGet(API.contract_queryContractStatus, {}).then(res => {
        this.contractStatusList = res.data.contractStatusList || []; //合同状态集合
      })
    },
    // 详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
    },
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.icon-gantanhao {
  color: #c0c4cc;
}
.main-default {
  .g-content {
    .m-main {
      .g-main {
        .h-table {
          .el-table thead th {
            .cell {
              border-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
