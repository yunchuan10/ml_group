<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置利用" :item="['处置台账']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/disposal-manage/disposal-ledger/disposal-ledger-list'}">
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>房间号</span>
                  <el-input clearable placeholder="请输入房间号" v-model="roomNo"></el-input>
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
        <h2 class="u-table-title">{{courtyardName}}—{{handleTypeName}}办公用房明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="申请单号">
            <template slot-scope="scope">
              <a @click="approvalDetailClick(scope.row.handleApplyId)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="buildArea" label="建筑面积（㎡）">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="estimatePrice" label="评估租金（元/月/平方米）" v-if="this.handleType ==='RENT'" width="190px" :key="Math.random()">
            <template slot-scope="scope">
              {{scope.row.estimatePrice || '—'}}
            </template>
          </el-table-column>
          <el-table-column prop="leaseTerm"  label="租赁期限（年）" v-if="this.handleType ==='RENT'" :key="Math.random()">
            <template slot-scope="scope">
              {{scope.row.leaseTerm || '—'}}
            </template>
          </el-table-column>
          <el-table-column prop="planPurpose" label="规划用途" v-if="this.handleType ==='RENT'" :key="Math.random()">
            <template slot-scope="scope">
              {{scope.row.planPurpose || '—'}}
            </template>
          </el-table-column>
          <el-table-column prop="lesseeName" label="承租人" v-if="this.handleType ==='RENT'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="clinchDealPrice" label="租金（元/年）" v-if="this.handleType ==='RENT'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="houseEstimateBuildAreaOfUnivalent" label="房屋评估建筑面积单价（万元/㎡）" width="280px" v-if="this.handleType ==='AUCTION'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价（万元）" v-if="this.handleType ==='AUCTION'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="receivePerson" label="受让人" v-if="this.handleType ==='AUCTION'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="clinchDealMoney" label="成交金额（万元）" v-if="this.handleType ==='AUCTION'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="manageOrganName" label="管理单位" v-if="this.handleType ==='CONVERSIONPURPOSES'" :key="Math.random()">
          </el-table-column>
          <el-table-column prop="purpose" label="转换用途" v-if="this.handleType ==='CONVERSIONPURPOSES'" :key="Math.random()">
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
    <!-- 详情组件 -->
    <disposal-detail ref="disposalDetail"></disposal-detail>
  </div>
</template>

<script>
import disposalDetail from '@/components/disposal-manage/disposal-detail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
  },
  data() {
    let date = new Date() - 24 * 60 * 60 * 1000;
    return {
      organName: '', // 单位名称
      handleType: '', //处置类型
      handleTypeName: '', //处置类型名称
      roomNo: '', //房间号
      areaName: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      Hpage: 1,
      courtyardId: '',
      courtyardName: ''
    };
  },
  activated() {
    if (this.$route.query.courtyardName) {
      this.courtyardName = this.$route.query.courtyardName;
    }
    if (this.$route.query.courtyardId) {
      this.courtyardId = this.$route.query.courtyardId;
    }
    if (this.$route.query.handleType) {
      this.handleType = this.$route.query.handleType;
      if (this.handleType === 'RENT') {
        this.handleTypeName = '已出租'
      } else if (this.handleType === 'AUCTION') {
        this.handleTypeName = '已拍卖'
      } else if (this.handleType === 'CONVERSIONPURPOSES') {
        this.handleTypeName = '已转换用途'
      } else {
        this.handleTypeName = '已拆除'
      }
    }
    if (this.$route.query.currentPage) {
      this.Hpage = this.$route.query.currentPage;
    }
    this.getDataRequest();
  },
  deactivated() {
    this.roomNo = '';
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
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        handleType: this.handleType,
        roomNo: this.roomNo || '',
        courtyardId: this.courtyardId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.handleapply_listAccessHandlerResultOrder, params).then(res => {
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
    exportClick() {  //导出
      let params = {
        areaId: this.areaId,
        queryTime: this.pushdate, //查询时间  
        exportFlag: 'YES',
        areaName: this.areaName,
        organName: this.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_getExcessiveOrganData, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      });
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
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
.el-date-editor.el-input {
  width: auto !important;
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
