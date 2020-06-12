<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
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
                <!-- <li>
                  <span>街道：</span>
                  <el-input clearable filterable placeholder="请输入街道名称" v-model="street">
                  </el-input>
                </li>
                <li>
                  <span>门牌号：</span>
                  <el-input clearable filterable placeholder="请输入门牌号" v-model="houseNo">
                  </el-input>
                </li> -->
                <li>
                  <span>合同编号</span>
                  <el-input clearable filterable placeholder="请输入合同编号" v-model="contractNo"></el-input>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入承租人" v-model="lesseeName"></el-input>
                </li>
                <!-- <li>
                  <span>状态</span>
                  <el-select v-model="exceed" clearable filterable placeholder="请选择状态"> -->
                <!-- <el-option label="全部" value=""></el-option> -->
                <!-- <el-option label="已入账" value="YES"></el-option>
                    <el-option label="逾期" value="OVERDUE"></el-option>
                    <el-option label="即将到期" value="DUE"></el-option> -->
                <!-- <el-option v-for="item in exceedList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"> -->
                <!-- </el-option> -->
                <!-- </el-select>
                </li> -->
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
        <h2 class="u-table-title">{{pushdate}} {{organName}}—经营性房产租金明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" type='index' width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="rentOrgan" label="出租方">
          </el-table-column>
          <el-table-column prop="lesseeName" label="承租人">
          </el-table-column>
          <el-table-column prop="contractNo" label="合同编号" width="140">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.contractId,'合同')">{{scope.row.contractNo}}</a>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="contractStartDate" label="合同开始日期">
            <template slot-scope="scope">
              {{scope.row.contractStartDate ?scope.row.contractStartDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column prop="contractEndDate" label="合同结束日期">
            <template slot-scope="scope">
              {{scope.row.contractEndDate ?scope.row.contractEndDate.substr(0, 10):'—'}}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="contractRental" label="合同租金（元/年）">
          </el-table-column> -->
          <el-table-column prop="rentalStartDate" label="租金起止日期">zhi
            <template slot-scope="scope">
              {{scope.row.rentalStartDate ? formartDate(scope.row.rentalStartDate):'—'}}
              至
              {{scope.row.rentalEndDate ? formartDate(scope.row.rentalEndDate):'—'}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="rentalEndDate" label="租金结束日期">
            <template slot-scope="scope">
              {{scope.row.rentalEndDate ?scope.row.rentalEndDate.substr(0, 10):'—'}}
            </template>
          </el-table-column> -->
          <el-table-column prop="rentalMoney" label="应交租金（元）">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.rentalInformationId,'租金')">{{scope.row.rentalMoney}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="缴纳时长">
          </el-table-column>
          <el-table-column prop="rentalInformation" label="状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.rentalInformation,scope.row.rentStatus)">
                {{scope.row.rentalInformation === 'YES' ? '已入账' : scope.row.rentalInformation === 'NO' ? scope.row.rentStatus === 'OVERDUE' ? '逾期' : scope.row.rentStatus === 'DUE' || scope.row.rentStatus === 'NORMAL' ? '即将到期' : '' : ''}}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="days" label="租金到期提醒">
            <template slot-scope="scope">
              {{scope.row.rentalInformation === 'YES' ? '--' : scope.row.rentalInformation === 'NO' ? scope.row.rentStatus === 'OVERDUE' ? '逾期：'+scope.row.days+'天' : scope.row.rentStatus === 'DUE' || scope.row.rentStatus === 'NORMAL' ? '剩余：'+scope.row.days+'天' : '' : ''}}
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class=" h-table-bottom f-clearfix">
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
    <ownership-detail ref="ownershipDetail"></ownership-detail>
  </div>
</template>

<script>
import ownershipDetail from '@/components/operate/overall-statistical/room-registernum'; // 详情弹出框 - 租金
import roomDetail from '@/components/operate/room-manage-street/room-companynum'; // 详情弹出框 - 合同
export default {
  components: {
    'ownership-detail': ownershipDetail,
    'v-room-detail': roomDetail
  },
  data() {
    return {
      duty: '', //职务级别
      personName: '', //姓名
      organName: '',
      pushdate: '', //时间
      myChart: {}, //统计表
      Hpage: 1, //记录传过来的页数
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合   
      // dutyList: [], //职务级别集合
      lesseeName: '', //承租人
      exceed: '', //租金值
      exceedList: [], //租金入账情况集合
      // street: '',
      // houseNo: '',
      contractNo: '',
    };
  },
  activated() {
    if (Object.keys(this.$route.query).length != 0) {
      this.organId = this.$route.query.organId;
      if (this.$route.query.areaId) {
        this.areaId = this.$route.query.areaId;
      }
      this.pushdate = this.$route.query.queryTime;
      this.organName = this.$route.query.organName;
      this.Hpage = this.$route.query.currentPage;
    }
    // this.street = '';
    // this.houseNo = '';
    this.contractNo = '';
    this.lesseeName = '';
    this.exceed = '';
    this.getDataRequest();
  },
  mounted() {
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  methods: {
    //租金下拉
    // getduty() {
    //   let params = {
    //     // organId: this.organId,
    //   }
    //   this.$axiosPost(API.rent_getRentalInformationSelect, params).then(res => {
    //     this.exceedList = res.data || '';
    //   })
    // },
    //后退
    formartDate(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return '';
      }
    },
    backHandle() {
      this.$router.back()
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        organId: this.organId,
        // street: this.street,
        // houseNo: this.houseNo,
        contractNo: this.contractNo,
        lesseeName: this.lesseeName,
        // rentStatus: "YES",
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosGet(API.dealstatistical_rentStatisticsMoneyList, params).then(res => {
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
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    exportClick() { // 导出
      let params = {
        organId: this.organId,
        areaId: this.areaId,
        // roomAddress: this.roomAddress,
        // street: this.street,
        // houseNo: this.houseNo,
        contractNo: this.contractNo,
        lesseeName: this.lesseeName,
        // rentPerson: this.rentPerson,
        // rentStatus: "YES",
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize,
        exportFlag: 'YES',
        organName: this.organName
      };
      this.$axiosPost(API.dealstatistical_rentStatisticsMoneyList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })
    },
    // 详情
    roomDetailInfoClick(roomId, type) {
      if (type == '合同') {
        this.$refs.roomDetail.openModal(roomId);
      } else {
        this.$refs.ownershipDetail.openModal(roomId);
      }
    },
    checkStatus(value, type) {
      if (value == 'YES') {
        return 's-state-apply'
      }
      if (value == 'NO' && type == 'OVERDUE') {
        return 's-state-prohibited'
      }
      if (value == 'NO' && type == 'DUE') {
        return 's-state-caveat'
      }
      if (value == 'NO' && type == 'NORMAL') {
        return 's-state-caveat'
      }
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
